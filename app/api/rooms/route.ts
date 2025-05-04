import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined');
if (!secret) throw new Error('JWT_SECRET is not defined');
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    try {
        await client.connect();
        const db = client.db('room');
        const collection = db.collection('room');

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const coSo = searchParams.get("coSo");
        const chatLuong = searchParams.get("chatLuong");
        const sucChua = searchParams.get("sucChua");
        const skip = (page - 1) * limit;

        const query: any = {};
        if (coSo) query.coSo = coSo;
        if (chatLuong) query.chatLuong = chatLuong;
        if (sucChua) query.sucChua = sucChua;

        const [rooms, total] = await Promise.all([
            collection
                .find(query, { projection: { name: 1, coSo: 1, chatLuong: 1, sucChua: 1, status: 1 } })
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(query)
        ]);

        return NextResponse.json({ rooms, total });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return new NextResponse('Failed to fetch rooms', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secret);
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Bạn không có quyền thêm phòng' }, { status: 403 });
        }

        const { name, coSo, sucChua, chatLuong } = await req.json();

        if (!name || !coSo || !sucChua || !chatLuong) {
            return NextResponse.json({ message: 'Thiếu thông tin phòng' }, { status: 400 });
        }

        await client.connect();
        const db = client.db('room');
        const rooms = db.collection('room');

        const newRoom = {
            name,
            coSo,
            sucChua,
            chatLuong,
            status: "1"
        };

        const result = await rooms.insertOne(newRoom);
        return NextResponse.json({ message: 'Thêm phòng thành công', id: result.insertedId });
    } catch (err: any) {
        return NextResponse.json({ message: 'Lỗi máy chủ', error: err.message }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const roomId = url.searchParams.get('id');
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, secret);
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Không có quyền xóa' }, { status: 403 });
        }
        if (!roomId) {
            return NextResponse.json({ message: 'Thiếu roomId' }, { status: 400 });
        }

        await client.connect();
        const db = client.db('room');
        const result = await db.collection('room').deleteOne({ _id: new ObjectId(roomId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Không tìm thấy phòng' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Xóa phòng thành công' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Xóa thất bại' }, { status: 500 });
    } finally {
        await client.close();
    }
}
