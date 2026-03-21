import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, phone, name, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    await Otp.deleteOne({ _id: validOtp._id });

    let user = await User.findOne({ email });
    if (!user) {
      if (!phone) {
        return NextResponse.json({ error: "Phone number is required for new accounts." }, { status: 400 });
      }
      user = await User.create({ email, phone, name: name || "" });
    } else {
      let updated = false;
      if (phone && user.phone !== phone) {
        user.phone = phone;
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (updated) await user.save();
    }

    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", user: { email: user.email, phone: user.phone, name: user.name } });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
