import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined');
if (!secret) throw new Error('JWT_SECRET is not defined');

const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Không có token" }, { status: 401 });
    }
    try {
        const decoded: any = jwt.verify(token, secret);

        const body = await req.json();

        const { roomId, date, startTime, endTime } = body;

        const roomCollection = client.db('room').collection('room');
        const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
        const roomName = room?.name;

        if (!roomId || !date || startTime == null || endTime == null) {
            return NextResponse.json({ message: "Thiếu thông tin đặt phòng" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("room");
        const newBooking = {
            roomId: new ObjectId(roomId),
            userId: new ObjectId(decoded._id),
            date,
            startTime,
            endTime,
            roomName,
        };
        await db.collection('booking').insertOne(newBooking);

        // Thêm thông báo vào db login, collection noti
        const loginDb = client.db('login');
        await loginDb.collection('noti').insertOne({
            userId: new ObjectId(decoded._id),
            content: `🎉 Bạn đã đặt phòng ${roomName} thành công!<br>Nhớ checkin <b>15 phút trước</b> giờ đặt phòng bạn nhé! 🕒`,
            createAt: new Date(),
        });

        return NextResponse.json({ message: "Đặt phòng thành công" });
    } catch (error: any) {
        console.error("Lỗi đặt phòng:", error.message);
        return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
    } finally {
        await client.close();
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
