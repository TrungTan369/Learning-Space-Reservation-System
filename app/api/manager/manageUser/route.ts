import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
    try {
        await client.connect();
        const db = client.db('login');
        const users = db.collection('users');

        const { searchParams } = new URL(req.url!);
        const name = searchParams.get('fullname');

        let query = {};
        if (name) {
            query = {
                $or: [
                    { fullname: { $regex: name, $options: 'i' } },
                    { username: { $regex: name, $options: 'i' } }
                ]
            };
        }

        const userList = await users.find(query, { projection: { password: 0 } }).toArray();

        return NextResponse.json({ users: userList });
    } catch (err) {
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    } finally {
        await client.close();
    }
}