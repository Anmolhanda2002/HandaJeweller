"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User as UserIcon, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await register(name, email, password, phone);
    if (res.success) {
      router.push("/account");
    } else {
      setError(res.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50/50 min-h-[80vh] py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Royal Membership
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
              Create Patron Account
            </h1>
            <p className="text-xs text-neutral-500">
              Join the Handa Jeweller private circle for privileged previews & rewards
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Kapoor"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

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
              <label className="block font-medium text-neutral-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Password (Min 6 chars)</label>
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

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Creating Account..." : "Join Now"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-800 hover:text-amber-900 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
