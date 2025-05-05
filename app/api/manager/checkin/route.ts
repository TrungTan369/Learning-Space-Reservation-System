import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const secret = process.env.JWT_SECRET!;
if (!uri) throw new Error('MONGODB_URI not defined');
if (!secret) throw new Error('JWT_SECRET not defined');

const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });

        const { roomName, mode } = await req.json();
        if (!roomName) return NextResponse.json({ message: 'Thiếu tên phòng' }, { status: 400 });

        await client.connect();
        const db = client.db('room');
        const loginDb = client.db('login');

        const room = await db.collection('room').findOne({ name: roomName });
        if (!room) return NextResponse.json({ message: 'Không tìm thấy phòng' }, { status: 404 });

        const now = new Date();
        const nowDateNum = parseInt(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        // Lấy tất cả các booking trong tương lai (theo ngày và giờ)
        const allBookings = await db.collection('booking')
            .find({ roomId: room._id })
            .sort({ date: 1, startTime: 1 })
            .toArray();

        const booking = allBookings.find((b: any) => {
            const [day, month, year] = b.date.split('/');
            const bookingDateNum = parseInt(`${year}${month}${day}`);
            if (bookingDateNum > nowDateNum) return true;
            if (bookingDateNum === nowDateNum && b.endTime >= nowMinutes) return true;
            return false;
        });

        if (!booking) {
            return NextResponse.json({ message: 'Không có lịch đặt nào trong tương lai' }, { status: 404 });
        }

        const user = await loginDb
            .collection('users')
            .findOne({ _id: new ObjectId(booking.userId) });

        if (!user) return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });

        let qrPayload = null;

        if (mode === 'checkin') {
            const checkinWindowMinutes = 110; // 1 giờ 50 phút
            const bookingStartMinutes = booking.startTime * 60;
            const timeUntilStart = bookingStartMinutes - nowMinutes;

            if (timeUntilStart > checkinWindowMinutes) {
                return NextResponse.json({ message: 'Chưa tới giờ checkin (trong vòng 1h50)' }, { status: 400 });
            }

            qrPayload = `checkin:${booking._id}:${booking.userId}`;
        }

        return NextResponse.json({
            booking: {
                fullname: user.fullname,
                roomName: room.name,
                startTime: booking.startTime,
                endTime: booking.endTime,
                date: booking.date,
            },
            qrPayload,
        });
    } catch (err) {
        console.error('Checkin error:', err);
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    } finally {
        await client.close();
    }
}
