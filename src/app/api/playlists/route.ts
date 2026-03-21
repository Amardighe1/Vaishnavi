import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

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
  const email = await getUserEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const playlists = await Playlist.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(playlists);
}

export async function POST(req: Request) {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await dbConnect();
    const playlist = await Playlist.create({ name, userEmail: email, songs: [] });
    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Create Playlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}