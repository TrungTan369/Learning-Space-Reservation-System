import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Environment variable MONGODB_URI is not defined');

const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const db = client.db('forum');
        const posts = await db.collection('forum').find().sort({ createAt: -1 }).toArray();
        return NextResponse.json(posts);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    } finally {
        await client.close();
    }
}

export async function POST(req: NextRequest) {
    const { title, content, authorId, role } = await req.json();

    if (role !== 'admin') {
        return NextResponse.json({ message: 'Không có quyền đăng bài' }, { status: 403 });
    }

    try {
        await client.connect();
        const db = client.db('forum');

        const user = await db.collection('users').findOne({ _id: new ObjectId(authorId) });
        if (!user) {
            return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
        }

        const newPost = {
            title,
            content,
            createAt: new Date(),
            author: user.fullname,
        };

        await db.collection('forum').insertOne(newPost);
        return NextResponse.json({ message: 'Đăng bài thành công' });
    } catch (err) {
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}