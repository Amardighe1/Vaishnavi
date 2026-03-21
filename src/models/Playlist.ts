import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
  coverUrl: { type: String, default: "" },
  songs: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);