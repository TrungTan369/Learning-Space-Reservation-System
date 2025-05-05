// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("Missing JWT_SECRET");

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ role: null }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secret);
        return NextResponse.json({ role: decoded.role });
    } catch (err) {
        return NextResponse.json({ role: null }, { status: 401 });
    }
}
