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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { song, action } = await req.json(); // action: "add" | "remove"
    if (!song || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await dbConnect();
    const playlist = await Playlist.findOne({ _id: params.id, userEmail: email });
    
    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });

    if (action === "add") {
      // Avoid duplicate songs
      if (!playlist.songs.find((s: any) => s.id === song.id)) {
        playlist.songs.push(song);
      }
    } else if (action === "remove") {
      playlist.songs = playlist.songs.filter((s: any) => s.id !== song.id);
    }

    if (playlist.songs.length > 0 && playlist.songs[0].coverUrl) {
       playlist.coverUrl = playlist.songs[0].coverUrl;
    } else {
       playlist.coverUrl = "";
    }

    await playlist.save();
    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    await Playlist.deleteOne({ _id: params.id, userEmail: email });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}