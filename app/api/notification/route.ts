import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json([], { status: 401 });
    }
    try {
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id || decoded.userId;

        await client.connect();
        const db = client.db('login');
        const notis = await db
            .collection('noti')
            .find({ userId: new ObjectId(userId) })
            .sort({ createAt: -1 })
            .toArray();

        return NextResponse.json(
            notis.map(n => ({
                content: n.content,
                createAt: n.createAt,
                read: n.read ?? false,
                icon: n.icon ?? "🔔"
            }))
        );
    } catch {
        return NextResponse.json([], { status: 403 });
    } finally {
        await client.close();
    }
}

// Đánh dấu tất cả đã đọc
export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }
    try {
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id || decoded.userId;

        await client.connect();
        const db = client.db('login');
        await db.collection('noti').updateMany(
            { userId: new ObjectId(userId), read: { $ne: true } },
            { $set: { read: true } }
        );
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ message: 'Lỗi xác thực' }, { status: 403 });
    } finally {
        await client.close();
    }
}