import mongoose from "mongoose";

const LikedSongSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  coverUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

// Drop Old Unique Index if exists on 'id' alone
export default mongoose.models.LikedSong || mongoose.model("LikedSong", LikedSongSchema);

