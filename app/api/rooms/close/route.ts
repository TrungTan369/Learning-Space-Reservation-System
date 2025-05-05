import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }

    try {
        // Nếu dùng jwt, giải mã và kiểm tra quyền admin ở đây
        // const decoded: any = jwt.verify(token, secret);
        // if (decoded.role !== 'admin') return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });

        const { searchParams } = new URL(req.url!);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ message: 'Thiếu id phòng' }, { status: 400 });

        await client.connect();
        const db = client.db('room');
        const result = await db.collection('room').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "0" } }
        );
        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Đã đóng phòng' });
        } else {
            return NextResponse.json({ message: 'Không tìm thấy phòng' }, { status: 404 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}