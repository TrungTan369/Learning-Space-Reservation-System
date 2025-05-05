import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
        }
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id || decoded.userId;
        const { email, birth, phone } = await req.json();

        await client.connect();
        const db = client.db('login');
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { email, birth, phone } }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ message: 'Không tìm thấy hoặc không thay đổi dữ liệu' }, { status: 400 });
        }
    } catch (err: any) {
        return NextResponse.json({ message: err.message || 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}