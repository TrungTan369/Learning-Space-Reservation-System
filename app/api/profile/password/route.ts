import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Environment variable MONGO_URI is not defined');
}
const client = new MongoClient(uri);

export async function PUT(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Không tìm thấy token xác thực' }, { status: 401 });
    }

    try {
        // Verify token
        const decoded: any = jwt.verify(token, secret);
        const { username, currentPassword, newPassword } = await req.json();

        // Connect to MongoDB
        await client.connect();
        const db = client.db('login');
        const users = db.collection('users');

        // Find user by username - no need to verify userId in token at this point
        const user = await users.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return NextResponse.json({ message: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
        }

        // Update password
        await users.updateOne(
            { username },
            { $set: { password: newPassword } }
        );

        return NextResponse.json({ message: 'Cập nhật mật khẩu thành công' });
    } catch (err: any) {
        console.error('Password change error:', err);

        if (err.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 401 });
        }

        if (err.name === 'TokenExpiredError') {
            return NextResponse.json({ message: 'Phiên đăng nhập đã hết hạn' }, { status: 401 });
        }

        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    } finally {
        await client.close();
    }
}