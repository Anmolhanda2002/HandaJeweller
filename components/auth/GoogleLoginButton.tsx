"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { X, ArrowRight } from "lucide-react";

interface GoogleLoginButtonProps {
  text?: string;
  redirectTo?: string;
}

function GoogleLoginButtonInner({
  text = "Continue with Google",
  redirectTo,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = redirectTo || searchParams.get("redirect") || "/account";

  const { loginWithGoogle } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenGoogle = () => {
    setError("");
    setShowPrompt(true);
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes("@")) {
      setError("Please enter a valid Google email address");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await loginWithGoogle({
      email: googleEmail.trim(),
      name: googleName.trim() || googleEmail.split("@")[0],
      googleId: `google_${Date.now()}`,
    });

    if (res.success) {
      setShowPrompt(false);
      router.push(redirect);
    } else {
      setError(res.message || "Google sign in failed");
      setIsLoading(false);
    }
  };

  const handleQuickDemoGoogle = async (name: string, email: string) => {
    setIsLoading(true);
    setError("");
    const res = await loginWithGoogle({
      email,
      name,
      googleId: `google_demo_${Date.now()}`,
    });
    if (res.success) {
      setShowPrompt(false);
      router.push(redirect);
    } else {
      setError(res.message || "Google sign in failed");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenGoogle}
        className="w-full bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition shadow-xs hover:border-neutral-400 active:scale-[0.99]"
      >
        {/* Official Google G Logo SVG */}
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{text}</span>
      </button>

      {/* Google Account Selector Dialog */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h4 className="font-semibold text-neutral-900 text-sm">
                  Sign in with Google
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Continue to <strong>Handa Jeweller</strong> with your Google Account for fast, secure checkout.
            </p>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Quick 1-Click Select Options */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemoGoogle("Anmol Handa", "handaanmol073@gmail.com")
                }
                className="w-full text-left p-3 rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                    AH
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block">Anmol Handa</span>
                    <span className="text-[11px] text-neutral-500 block">handaanmol073@gmail.com</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-800 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemoGoogle("Ananya Sharma", "customer@example.com")
                }
                className="w-full text-left p-3 rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    AS
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block">Ananya Sharma</span>
                    <span className="text-[11px] text-neutral-500 block">customer@example.com</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-800 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Custom Google Email Form */}
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-[11px] font-semibold text-neutral-600 mb-2">
                Or sign in with another Google email:
              </p>
              <form onSubmit={handleGoogleSubmit} className="space-y-2.5 text-xs">
                <input
                  type="email"
                  required
                  placeholder="your.google@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                />
                <input
                  type="text"
                  placeholder="Your Full Name (optional)"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isLoading ? "Signing in..." : "Continue with this Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  return (
    <Suspense
      fallback={
        <button
          type="button"
          disabled
          className="w-full bg-white border border-neutral-300 text-neutral-400 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-3 opacity-60"
        >
          <span>{props.text || "Continue with Google"}</span>
        </button>
      }
    >
      <GoogleLoginButtonInner {...props} />
    </Suspense>
  );
}

