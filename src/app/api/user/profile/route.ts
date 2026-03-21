import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function PUT(req: Request) {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secretKey);
    const body = await req.json();
    const { name, avatarUrl } = body;

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { $set: { name, avatarUrl } },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        email: user.email,
        name: user.name || "",
        avatarUrl: user.avatarUrl || "",
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}