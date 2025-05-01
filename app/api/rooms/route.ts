import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined');

const client = new MongoClient(uri);
const dbName = 'room';
const collectionName = 'room';

export async function GET(req: NextRequest) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const coSo = searchParams.get("coSo");
        const chatLuong = searchParams.get("chatLuong");
        const sucChua = searchParams.get("sucChua");
        const skip = (page - 1) * limit;

        const query: any = {};
        if (coSo) query.coSo = coSo;
        if (chatLuong) query.chatLuong = chatLuong;
        if (sucChua) query.sucChua = sucChua;

        const [rooms, total] = await Promise.all([
            collection
                .find(query, { projection: { name: 1, coSo: 1, chatLuong: 1, sucChua: 1 } })
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(query)
        ]);

        return NextResponse.json({ rooms, total });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return new NextResponse('Failed to fetch rooms', { status: 500 });
    }
}
