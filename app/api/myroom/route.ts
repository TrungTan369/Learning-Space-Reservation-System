import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;

        await client.connect();
        const db = client.db();

        // 1. Truy vấn collection bookings theo userId
        const bookings = await db
            .collection('booking')
            .find({ userId: new ObjectId(userId) })
            .toArray();

        // 2. Lấy tất cả roomId cần dùng
        const roomIds = bookings.map(b => b.roomId);
        const rooms = await db
            .collection('room')
            .find({ _id: { $in: roomIds } })
            .toArray();

        // 3. Gộp thông tin lại
        const roomMap = Object.fromEntries(rooms.map(r => [r._id.toString(), r]));

        const result = bookings.map(b => ({
            roomName: roomMap[b.roomId.toString()]?.name || 'Không rõ',
            coSo: roomMap[b.roomId.toString()]?.coSo || '',
            chatLuong: roomMap[b.roomId.toString()]?.chatLuong || '',
            sucChua: roomMap[b.roomId.toString()]?.sucChua || '',
            date: b.date,
            startTime: b.startTime,
            endTime: b.endTime,
        }));

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 403 });
    }
}
