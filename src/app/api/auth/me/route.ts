import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    await connectDB();
    const dbUser = await User.findOne({ email: payload.email }).lean();

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { 
        email: dbUser.email, 
        name: dbUser.name || "",
        avatarUrl: dbUser.avatarUrl || "",
        phone: dbUser.phone
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

