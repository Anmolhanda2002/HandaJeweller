"use client";

import React, { useState } from "react";
import { User as UserIcon, Mail, Phone, Lock, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");

    const res = await updateProfile({ name, phone });
    if (res.success) {
      setSuccessMessage("Profile updated successfully");
    } else {
      setErrorMessage(res.message || "Failed to update profile");
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-neutral-100">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Personal Information
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Manage your contact credentials and patron account profile
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-xs">
        <div>
          <label className="block font-medium text-neutral-700 mb-1">Full Name</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              disabled
              value={user?.email || ""}
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
            />
          </div>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">
            Primary email address cannot be changed directly.
          </span>
        </div>

        <div>
          <label className="block font-medium text-neutral-700 mb-1">Mobile Phone</label>
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-neutral-900 hover:bg-amber-900 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
          >
            {isUpdating ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
