import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined');
if (!secret) throw new Error('JWT_SECRET is not defined');

const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: "Không có token" }, { status: 401 });
        }

        const decoded = jwt.verify(token, secret) as { userId: string };
        const userId = decoded.userId;

        const body = await req.json();
        const { roomId, date, startTime, endTime } = body;

        if (!roomId || !date || !startTime || !endTime) {
            return NextResponse.json({ message: "Thiếu thông tin đặt phòng" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("room");
        const bookingCollection = db.collection("booking");

        // Lưu lịch đặt
        const result = await bookingCollection.insertOne({
            roomId: new ObjectId(roomId),
            userId: new ObjectId(userId),
            date,
            startTime,
            endTime,
        });

        return NextResponse.json({ message: "Đặt phòng thành công", bookingId: result.insertedId }, { status: 201 });

    } catch (error: any) {
        console.error("Lỗi đặt phòng:", error.message);
        return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const date = searchParams.get("date");

    if (!roomId || !date) {
        return NextResponse.json({ error: "Thiếu roomId hoặc date" }, { status: 400 });
    }

    try {
        await client.connect();
        const db = client.db("room");

        const bookings = await db.collection("booking").find({
            roomId: new ObjectId(roomId),
            date: date,
        }).toArray();

        const bookedSlots: string[] = [];
        for (const b of bookings) {
            const start = parseInt(b.startTime);
            const end = parseInt(b.endTime);
            for (let i = start; i <= end; i++) {
                bookedSlots.push(i.toString());
            }
        }

        return NextResponse.json({ bookedSlots });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
