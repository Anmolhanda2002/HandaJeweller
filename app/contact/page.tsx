"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Sparkles, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-neutral-50/50 min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Private Concierge
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Connect With Our Ateliers
          </h1>
          <p className="text-xs text-neutral-500">
            Book an in-person private viewing at our showroom or speak directly with our certified diamond specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="bg-neutral-900 text-white p-8 rounded-3xl space-y-6">
            <h3 className="font-serif text-xl font-bold">Handa Jeweller Showroom</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              We welcome private consultations for bespoke bridal suites, solitaire rings, and high jewelry commissions.
            </p>

            <div className="space-y-4 text-xs pt-4 border-t border-neutral-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                <span>Datarpur, Talwara Main Market, Punjab</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 77175 95732</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>handaanmol073@gmail.com</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400">
              <p className="font-semibold text-white mb-1">Hours of Service:</p>
              <p>Monday – Saturday: 10:30 AM – 8:00 PM IST</p>
              <p>Sunday: By Prior Appointment Only</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">Message Received</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for reaching out. A senior jewelry specialist will contact you within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">Send an Inquiry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 77175 95732"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-medium mb-1">Inquiry / Custom Request</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the jewelry style, ring size, or custom design you have in mind..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-amber-900 text-white font-semibold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
