// File: app/api/checkin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
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
        const today = now.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const bookings = await db.collection('booking')
            .find({ roomId: room._id, date: today })
            .sort({ startTime: 1 })
            .toArray();

        // Find the current or next booking
        const currentBooking = bookings.find((b: any) => 
            // Current time is before the end time of the booking
            b.endTime > nowMinutes && 
            // Current time is after or equal to (start time - 30 minutes)
            nowMinutes >= (b.startTime - 30)
        );

        if (!currentBooking) {
            return NextResponse.json({ 
                message: 'Không có lịch đặt nào trong khoảng thời gian checkin hợp lệ',
                status: 'invalid_time' 
            }, { status: 404 });
        }

        const user = await loginDb
            .collection('users')
            .findOne({ _id: new ObjectId(currentBooking.userId) });

        if (!user) return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });

        let qrPayload = null;

        if (mode === 'checkin') {
            // 30 minutes before start time
            const checkinWindowMinutes = 30;
            const bookingStartMinutes = currentBooking.startTime;
            const timeUntilStart = bookingStartMinutes - nowMinutes;

            if (timeUntilStart > checkinWindowMinutes) {
                return NextResponse.json({ 
                    message: 'Chưa tới giờ checkin (30 phút trước giờ bắt đầu)',
                    status: 'too_early'
                }, { status: 400 });
            }

            if (nowMinutes > currentBooking.endTime) {
                return NextResponse.json({ 
                    message: 'Đã quá thời gian checkin',
                    status: 'too_late'
                }, { status: 400 });
            }

            qrPayload = `checkin:${currentBooking._id}:${currentBooking.userId}`;
        }

        // Format times for display
        const formatTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

        return NextResponse.json({
            booking: {
                fullname: user.fullname,
                roomName: room.name,
                startTime: formatTime(currentBooking.startTime),
                endTime: formatTime(currentBooking.endTime),
                date: currentBooking.date,
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
