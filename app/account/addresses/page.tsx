"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2, Check, Star } from "lucide-react";
import { useAuth, UserAddress } from "@/context/AuthContext";

export default function AddressBookPage() {
  const { user, updateProfile } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>(user?.addresses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<UserAddress>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "Delhi",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updated = [...addresses, newAddr];
    if (newAddr.isDefault || updated.length === 1) {
      updated.forEach((a, i) => {
        a.isDefault = i === updated.length - 1;
      });
    }

    const res = await updateProfile({ addresses: updated });
    if (res.success) {
      setAddresses(updated);
      setShowAddForm(false);
      setNewAddr({
        fullName: user?.name || "",
        phone: user?.phone || "",
        street: "",
        city: "",
        state: "Delhi",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    }
    setIsSaving(false);
  };

  const handleDeleteAddress = async (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    const res = await updateProfile({ addresses: updated });
    if (res.success) {
      setAddresses(updated);
    }
  };

  const handleSetDefault = async (index: number) => {
    const updated = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index,
    }));
    const res = await updateProfile({ addresses: updated });
    if (res.success) {
      setAddresses(updated);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Address Book
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your insured delivery destinations
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Address
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4 text-xs">
          <h3 className="font-semibold text-neutral-900 text-sm">Add New Destination</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-medium mb-1">Street Address</label>
              <input
                type="text"
                required
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">City</label>
              <input
                type="text"
                required
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">PIN Code</label>
              <input
                type="text"
                required
                value={newAddr.postalCode}
                onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newAddr.isDefault}
              onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
              className="accent-amber-700"
            />
            <span className="text-neutral-700 font-medium">Set as default delivery address</span>
          </label>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold px-5 py-2.5 rounded-xl uppercase tracking-wider"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-neutral-200 text-neutral-700 font-medium px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
              addr.isDefault
                ? "border-amber-700 bg-amber-50/20"
                : "border-neutral-200 bg-neutral-50/30"
            }`}
          >
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="bg-amber-100 text-amber-900 font-semibold text-[10px] px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p>{addr.country}</p>
              <p className="text-neutral-500 pt-1">Phone: {addr.phone}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(idx)}
                  className="text-amber-800 hover:text-amber-900 font-medium"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Primary Address
                </span>
              )}

              <button
                onClick={() => handleDeleteAddress(idx)}
                className="text-neutral-400 hover:text-rose-600 transition"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
