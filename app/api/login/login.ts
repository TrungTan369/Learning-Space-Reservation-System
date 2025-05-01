import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';


console.log("MONGO_URI = ", process.env.MONGODB_URI);

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Environment variable MONGO_URI is not defined');
}
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    try {
        await client.connect();
        const db = client.db('login');
        const users = db.collection('users');

        const user = await users.findOne({ username, password });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            role: user.role,
            username: user.username
        });
    } catch (error) {
        console.error("Server error:", error); // 👈 thêm dòng này để xem lỗi
        return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}
