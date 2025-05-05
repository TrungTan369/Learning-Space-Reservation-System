import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ bookings: [] }, { status: 401 });
    }
    try {
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded._id || decoded.userId;

        await client.connect();
        const db = client.db();
        const bookings = await db
            .collection('booking')
            .find({ userId: new ObjectId(userId) })
            .project({ date: 1, _id: 0 })
            .toArray();

        // Trả về mảng ngày đặt phòng dạng ["dd/mm/yyyy", ...]
        const bookingDates = bookings.map((b: any) => b.date);

        return NextResponse.json({ bookings: bookingDates });
    } catch {
        return NextResponse.json({ bookings: [] }, { status: 403 });
    } finally {
        await client.close();
    }
}