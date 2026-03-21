"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchLikedSongs = useUserStore((state) => state.fetchLikedSongs);

  useEffect(() => {
    const queryMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    if (queryMode !== mode) setMode(queryMode);
  }, [searchParams, mode]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = { email, otp };
      if (mode === "signup") {
        payload.phone = phone;
        payload.name = name;
      }

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchUser(); 
      await fetchLikedSongs();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setStep("details");
    setError("");
    router.replace(`/login?mode=${newMode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-2xl border border-white/5 relative overflow-hidden">
        
        {step === "details" && (
          <div className="flex bg-black/40 p-1 rounded-full mb-8">
            <button 
              onClick={() => toggleMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${mode === 'login' ? 'bg-white text-black shadow-md' : 'text-text-secondary hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => toggleMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${mode === 'signup' ? 'bg-white text-black shadow-md' : 'text-text-secondary hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          {step === "otp" ? "Check your email" : (mode === "login" ? "Welcome back" : "Create an account")}
        </h1>
        <p className="text-text-secondary text-sm text-center mb-8">
          {step === "otp" 
            ? `We sent a 6-digit code to ${email}`
            : (mode === "login" ? "Log in to your account with your email." : "Sign up for free to start listening.")}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm text-center font-medium">
            {error}
          </div>
        )}

        {step === "details" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-love-soft transition-colors placeholder:text-[#555]"
                  placeholder="What should we call you?"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-love-soft transition-colors placeholder:text-[#555]"
                placeholder="name@example.com"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-love-soft transition-colors placeholder:text-[#555]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || (mode === "signup" && !phone)}
              className="mt-4 w-full bg-love-soft text-white py-3.5 rounded-full font-bold hover:bg-love-accent hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
            >
              {loading ? "Sending Code..." : (mode === "login" ? "Log In" : "Sign Up")}
            </button>
            
            {mode === "login" && (
              <p className="text-center text-xs text-text-secondary mt-2">
                No password required. We&apos;ll send you a secure OTP.
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 text-center">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-4 text-white focus:outline-none focus:border-love-soft transition-colors text-center tracking-[0.75em] text-2xl font-mono"
                placeholder="000000"
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-love-soft text-white py-3.5 rounded-full font-bold hover:bg-love-accent hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-text-secondary text-sm font-medium hover:text-white transition-colors py-2"
              >
                ? Use a different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[80vh] text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
