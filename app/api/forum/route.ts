import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const secret = process.env.JWT_SECRET!;
if (!uri) throw new Error('Environment variable MONGODB_URI is not defined');
if (!secret) throw new Error('Environment variable JWT_SECRET is not defined');

const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const forum_db = client.db('forum');
        const login_db = client.db('login');

        const posts = await forum_db.collection('forum').find().sort({ createAt: -1 }).toArray();
        const authorIds = posts.map(p => p.author).filter(Boolean);
        const authors = await login_db
            .collection('users')
            .find({ _id: { $in: authorIds.map(id => new ObjectId(id)) } })
            .toArray();

        const authorMap = new Map(
            authors.map(users => [users._id.toString(), users.fullname])
        );

        const post = posts.map(post => ({
            ...post,
            authorName: authorMap.get(post.author?.toString()) || 'Không rõ',
        }));

        return NextResponse.json(post);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    } finally {
        await client.close();
    }
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secret);
        const { title, content } = await req.json();

        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Không có quyền đăng bài' }, { status: 403 });
        }

        await client.connect();
        const db = client.db('forum');

        const newPost = {
            title,
            content,
            createAt: new Date(),
            author: new ObjectId(decoded._id),
        };

        await db.collection('forum').insertOne(newPost);

        return NextResponse.json({ message: 'Đăng bài thành công' });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: 'Lỗi máy chủ hoặc token không hợp lệ' }, { status: 500 });
    } finally {
        await client.close();
    }
}

export async function DELETE(req: NextRequest) {
    interface JwtPayload {
        _id: string;
        role: string;
        fullname: string;
    }
    const tokenHeader = req.headers.get('authorization');
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Thiếu token' }, { status: 401 });
    }
    const token = tokenHeader.split(' ')[1];
    let user;
    try {
        user = jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
        return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 403 });
    }
    if (user.role !== 'admin') {
        return NextResponse.json({ message: 'Không có quyền xoá bài viết' }, { status: 403 });
    }
    const postId = req.nextUrl.searchParams.get('id');
    if (!postId) {
        return NextResponse.json({ message: 'Thiếu ID bài viết' }, { status: 400 });
    }
    try {
        await client.connect();
        const db = client.db('forum');
        await db.collection('forum').deleteOne({ _id: new ObjectId(postId) });

        return NextResponse.json({ message: 'Đã xoá bài viết thành công' });
    } catch (err) {
        console.error('Lỗi xoá bài:', err);
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
}