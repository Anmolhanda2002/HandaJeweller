"use client";

import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);
  const WHATSAPP_NUMBER = "917717595732"; // Handa Jeweller Official WhatsApp

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      "Namaste Handa Jeweller! I am contacting you regarding your gold & diamond jewellery collections and order delivery."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 print:hidden">
      {/* Tooltip Label */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-neutral-900/95 text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-xl border border-neutral-700/80 transition-all duration-300 pointer-events-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Chat on WhatsApp (+91 77175 95732)</span>
      </div>

      {/* Official WhatsApp Floating Button */}
      <button
        onClick={handleOpenWhatsApp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with Handa Jeweller on WhatsApp"
        title="Chat with Handa Jeweller on WhatsApp (+91 77175 95732)"
      >
        {/* Ambient Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>

        {/* Authentic Official WhatsApp Icon SVG */}
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-current relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.002 0C7.164 0 0 7.164 0 16.002c0 2.825.738 5.578 2.14 7.999L.085 31.915l8.118-2.128A15.908 15.908 0 0 0 16.002 32C24.84 32 32 24.84 32 16.002 32 7.164 24.84 0 16.002 0zm0 29.333c-2.484 0-4.908-.667-7.026-1.928l-.504-.3-5.215 1.368 1.392-5.083-.33-.524a13.254 13.254 0 0 1-2.03-7.864c0-7.352 5.98-13.333 13.333-13.333 7.353 0 13.333 5.981 13.333 13.333 0 7.353-5.98 13.333-13.333 13.333zm7.324-9.98c-.402-.201-2.378-1.173-2.746-1.307-.369-.134-.637-.201-.905.201-.268.402-1.039 1.307-1.273 1.575-.235.268-.469.302-.871.101-.402-.201-1.7-.626-3.238-1.998-1.197-1.067-2.006-2.385-2.24-2.787-.235-.402-.025-.62.176-.82.181-.181.402-.469.603-.704.201-.235.268-.402.402-.67.134-.268.067-.503-.034-.704-.101-.201-.905-2.18-1.24-2.984-.327-.783-.659-.676-.905-.689h-.771c-.268 0-.704.101-1.072.503-.369.402-1.407 1.374-1.407 3.351 0 1.977 1.441 3.887 1.642 4.155.201.268 2.835 4.329 6.868 6.071.959.414 1.708.662 2.292.848.963.306 1.839.263 2.531.16.772-.115 2.378-.972 2.713-1.91.335-.938.335-1.742.235-1.91-.1-.168-.369-.268-.771-.469z" />
        </svg>
      </button>
    </div>
  );
}
