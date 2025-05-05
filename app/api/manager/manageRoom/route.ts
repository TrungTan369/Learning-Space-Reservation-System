import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const db = client.db('room');
        const bookings = await db.collection('booking').find().toArray();

        // Lấy tháng/năm hiện tại
        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();

        // Thống kê theo phòng
        const statsMap: Record<string, { total: number; checkin: number }> = {};
        let monthBookings = 0;
        let monthCheckins = 0;

        bookings.forEach(b => {
            // Đếm cho từng phòng
            const name = b.roomName;
            if (!statsMap[name]) statsMap[name] = { total: 0, checkin: 0 };
            statsMap[name].total += 1;
            if (b.checkin) statsMap[name].checkin += 1;

            // Đếm cho tháng này
            if (b.date) {
                // Giả sử b.date là "DD/MM/YYYY"
                const [day, month, year] = b.date.split('/').map(Number);
                if (month === thisMonth && year === thisYear) {
                    monthBookings += 1;
                    if (b.checkin) monthCheckins += 1;
                }
            }
        });

        const stats = Object.entries(statsMap).map(([roomName, { total, checkin }]) => ({
            roomName,
            totalBookings: total,
            totalCheckins: checkin,
            checkinRate: total ? (checkin / total) * 100 : 0,
            noCheckinRate: total ? ((total - checkin) / total) * 100 : 0,
        }));

        return NextResponse.json({
            stats,
            monthBookings,
            monthCheckins,
        });
    } catch (err) {
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}