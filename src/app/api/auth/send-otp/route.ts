import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (replaces old OTP if it exists for this email)
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: otpCode });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Songs For You" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Authentication Code",
      text: `Your login code is: ${otpCode}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: white; text-align: center; border-radius: 10px;">
          <h2 style="color: #E50914;">Songs For You - Login Code</h2>
          <p style="font-size: 16px;">Hello! Use the code below to sign in or register.</p>
          <div style="margin: 20px auto; padding: 15px; background-color: #282828; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
            ${otpCode}
          </div>
          <p style="color: gray; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

