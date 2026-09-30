"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await login(email, password);
    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50/50 min-h-[75vh] py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5 text-amber-700" /> Patron Portal
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-neutral-500">
              Access your saved addresses, order status, and wishlist
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <div className="space-y-3">
            <GoogleLoginButton text="Sign in with Google" />
            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-neutral-400 uppercase tracking-wider relative">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-neutral-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-amber-800 hover:text-amber-900 text-[11px] font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 hover:bg-amber-900 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-md"
            >
              {isLoading ? "Authenticating..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-amber-800 hover:text-amber-900 font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
