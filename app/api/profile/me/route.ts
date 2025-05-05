import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
        }
        
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id || decoded.userId;

        await client.connect();
        const db = client.db('login');
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });
        }

        // Loại bỏ thông tin nhạy cảm
        const { password, ...userData } = user;
        
        return NextResponse.json(userData);
    } catch (err: any) {
        console.error('Profile API Error:', err);
        return NextResponse.json({ message: err.message || 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}