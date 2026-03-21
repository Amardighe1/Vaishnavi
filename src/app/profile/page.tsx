"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { User, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function ProfilePage() {
  const { user, logout, fetchUser } = useUserStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Protect route
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl }),
      });

      if (res.ok) {
        await fetchUser(); // Reload Zustand store state
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const errorData = await res.json();
        setMessage({ type: "error", text: errorData.error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: ~1MB optimally so DB avoids crashing
    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 1MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-[90vh] px-6 py-10 pb-32 max-w-2xl mx-auto w-full relative">
      <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

      <div className="bg-surface p-8 rounded-2xl shadow-lg border border-white/5">
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-4">
            {/* Avatar Preview */}
            <div className="w-28 h-28 rounded-full bg-surfaceHover flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-love-soft relative group">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-text-secondary" />
              )}
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Profile Picture
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-surfaceHover border border-[#333] rounded-lg px-4 py-2.5 text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-love-soft file:text-white hover:file:bg-love-accent cursor-pointer transition-colors"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2">Max limit: 1MB. (Square recommended)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surfaceHover border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-text-secondary focus:outline-none focus:border-love-soft transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Email
              </label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-2.5 text-text-secondary cursor-not-allowed opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={user.phone || "Not provided"}
                disabled
                className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-2.5 text-text-secondary cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          {message && (
            <div className={clsx(
              "flex items-center gap-2 text-sm p-3 rounded-lg mt-2",
              message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            )}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-love-soft hover:bg-love-accent text-white font-bold py-2.5 px-8 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-text-secondary hover:border-white text-text-secondary hover:text-white font-semibold py-2.5 px-8 rounded-full transition-colors"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}