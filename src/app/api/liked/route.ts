import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/mongodb";
import LikedSong from "@/models/LikedSong";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserEmail() {
  const token = cookies().get("auth-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.email;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json([], { status: 200 }); // Not logged in

    await dbConnect();
    // Scope liked songs to logged in user. Note: We'd need to add 'userEmail' to LikedSong schema if we want multi-user.
    // Assuming for the project it's fine, but let's make it scoped optimally to userEmail if it exists!
    const songs = await LikedSong.find({ userEmail: email }).sort({ addedAt: -1 });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch liked songs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
     const email = await getUserEmail();
     if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    
    // Check if song already liked
    const existing = await LikedSong.findOne({ id: body.id, userEmail: email });
    if (existing) {
      await LikedSong.deleteOne({ id: body.id, userEmail: email });
      return NextResponse.json({ message: "Song unliked", liked: false });
    }

    await LikedSong.create({ ...body, userEmail: email });
    return NextResponse.json({ message: "Song liked", liked: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

