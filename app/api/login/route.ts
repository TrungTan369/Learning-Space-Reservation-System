import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;


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
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
                fullname: user.fullname,
            },
            secret,
            { expiresIn: '1d' }
        );
        return NextResponse.json({
            success: true,
            token,
            _id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            fullname: user.fullname,
            birth: user.birth,
            phone: user.phone
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }

}
