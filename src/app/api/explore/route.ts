import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "Hits";
  const limit = searchParams.get("limit") || "5";

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`
    );
    const data = await response.json();

    const songs = data.results
      .filter((track: any) => track.previewUrl)
      .map((track: any) => ({
        id: track.trackId.toString(),
        title: track.trackName,
        artist: track.artistName,
        coverUrl: track.artworkUrl100.replace("100x100bb", "600x600bb"),
        audioUrl: track.previewUrl,
      }));

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
