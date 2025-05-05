import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Environment variable MONGO_URI is not defined');
}
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }

    try {
        // Use decoded._id instead of decoded.userId
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id;  // Fixed: use _id from token

        await client.connect();
        // Use specific database names
        const db = client.db('room');

        // 1. Query bookings by userId
        const bookings = await db
            .collection('booking')
            .find({ userId: new ObjectId(userId) })
            .toArray();

        // 2. Get all related room IDs
        const roomIds = bookings.map(b => b.roomId);
        const rooms = await db
            .collection('room')
            .find({ _id: { $in: roomIds } })
            .toArray();

        // 3. Combine information
        const roomMap = Object.fromEntries(rooms.map(r => [r._id.toString(), r]));

        const result = bookings.map(b => ({
            _id: b._id.toString(),  // Include booking ID for actions like cancellation
            roomId: b.roomId.toString(),  // Include room ID for reference
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
        console.error('Error in myroom API:', err);
        return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 403 });
    } finally {
        await client.close();
    }
}