"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Phone,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
  link?: { url: string; label: string; isExternal?: boolean };
}

const QUICK_CHIPS = [
  { label: "🪙 Gold Rate & Purity", query: "What is today's gold rate and BIS hallmark purity?" },
  { label: "📦 Track My Order", query: "How do I track my order delivery?" },
  { label: "💳 50% COD Policy", query: "How does Cash on Delivery with 50% advance booking work?" },
  { label: "📍 Store Location & Hours", query: "Where is Handa Jeweller located and what are store timings?" },
  { label: "💍 Custom Bridal Jewelry", query: "Can I customize a bridal set or solitaire ring?" },
  { label: "🛡️ Return & Warranty", query: "What is your return and lifetime buyback policy?" },
];

export default function JewelryChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: "welcome-1",
    sender: "bot",
    text: "Namaste! Welcome to Handa Jeweller Atelier. I am your personal jewelry specialist. How may I assist you with our collections, certified solitaires, or order delivery today?",
    timestamp: "Just now",
    options: [
      { label: "Today's Gold Rate", action: "gold_rate" },
      { label: "50% COD Terms", action: "cod_policy" },
      { label: "Track Order", action: "track_order" },
      { label: "Store Address", action: "store_location" },
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const getBotResponse = (userInput: string): { text: string; link?: { url: string; label: string; isExternal?: boolean }; options?: { label: string; action: string }[] } => {
    const query = userInput.toLowerCase().trim();

    // 1. Gold Rate & Hallmark
    if (
      query.includes("gold rate") ||
      query.includes("gold price") ||
      query.includes("purity") ||
      query.includes("22k") ||
      query.includes("24k") ||
      query.includes("hallmark") ||
      query.includes("bis") ||
      query === "gold_rate"
    ) {
      return {
        text: "✨ **Handa Jeweller Gold Standards:**\n\n• **22 Karat (916):** 100% BIS Hallmarked with unique laser-engraved HUID accreditation. Every piece is crafted in certified 91.6% pure gold.\n• **24 Karat (999):** Investment-grade bullion mint bars & coins.\n• **Diamonds:** GIA (Gemological Institute of America) & IGI certified solitaires (VVS1-VS2 clarity, E-F color).\n\nDaily bullion rates fluctuate with international market standards. For today's spot rate or custom weighing, please contact our showroom directly.",
        link: {
          url: "https://wa.me/917717595732?text=Namaste%2C%20please%20share%20today%27s%20exact%2022K%20and%2024K%20gold%20rate%20per%20gram.",
          label: "Ask Live Gold Rate on WhatsApp",
          isExternal: true,
        },
      };
    }

    // 2. 50% COD Policy & Advance
    if (
      query.includes("cod") ||
      query.includes("cash on delivery") ||
      query.includes("advance") ||
      query.includes("half") ||
      query.includes("cancel") ||
      query === "cod_policy"
    ) {
      return {
        text: "💳 **50% Advance Cash on Delivery Policy:**\n\n• For precious high-value jewellery, we provide Cash on Delivery with **50% advance booking deposit** paid securely online via Razorpay (UPI, Cards, NetBanking).\n• The remaining **50% balance** is paid in cash upon delivery at your doorstep.\n• **Strict Non-Cancellation Clause:** Because precious gold bullion is reserved and individually hallmarked upon order confirmation, orders placed under 50% advance COD cannot be cancelled once placed.\n• Full 100% online payment via Razorpay is also available with zero balance upon delivery.",
        link: {
          url: "/terms",
          label: "Read Full Commercial Terms",
          isExternal: false,
        },
      };
    }

    // 3. Track Order
    if (
      query.includes("track") ||
      query.includes("order") ||
      query.includes("delivery") ||
      query.includes("shipping") ||
      query.includes("dispatch") ||
      query === "track_order"
    ) {
      return {
        text: "📦 **Order Tracking & Insured Dispatch:**\n\n• All orders are dispatched via tamper-proof, transit-insured armored air couriers.\n• Estimated delivery: 3–5 business days across all 36 Indian States & UTs.\n• You can check your real-time status in your Account under **Order History**.\n• You can also receive instant WhatsApp dispatch notifications directly to your phone.",
        link: {
          url: "/account/orders",
          label: "Go to My Orders",
          isExternal: false,
        },
        options: [
          { label: "WhatsApp Delivery Tracking", action: "wa_track" },
        ],
      };
    }

    // 4. WhatsApp Tracking trigger
    if (query === "wa_track") {
      return {
        text: "📲 We provide live WhatsApp delivery updates with courier tracking numbers and one-time password (OTP) verification on dispatch.",
        link: {
          url: "https://wa.me/917717595732?text=Namaste%2C%20I%20would%20like%20to%20track%20my%20order%20delivery.",
          label: "Message Delivery Desk on WhatsApp",
          isExternal: true,
        },
      };
    }

    // 5. Store Location & Hours
    if (
      query.includes("location") ||
      query.includes("address") ||
      query.includes("store") ||
      query.includes("shop") ||
      query.includes("talwara") ||
      query.includes("punjab") ||
      query.includes("hours") ||
      query.includes("timing") ||
      query === "store_location"
    ) {
      return {
        text: "📍 **Handa Jeweller Flagship Atelier:**\n\n• **Address:** Main Market, Datarpur, Talwara, District Hoshiarpur, Punjab, India (PIN: 144216)\n• **Showroom Hours:** Monday – Saturday: 10:00 AM – 8:00 PM IST (Sunday by appointment)\n• **Parking & VIP Consultation:** Private viewing suite available for bridal trousseau selection.\n• **Phone / WhatsApp:** +91 77175 95732",
        link: {
          url: "https://maps.google.com/?q=Talwara+Main+Market+Punjab+Handa+Jeweller",
          label: "Open in Google Maps",
          isExternal: true,
        },
      };
    }

    // 6. Custom Bridal & Solitaire
    if (
      query.includes("bridal") ||
      query.includes("custom") ||
      query.includes("necklace") ||
      query.includes("solitaire") ||
      query.includes("ring") ||
      query.includes("polki") ||
      query.includes("trousseau")
    ) {
      return {
        text: "👑 **Custom Bridal Trousseau & Bespoke Solitaires:**\n\n• We design bespoke engagement rings, royal choker sets, rani haars, and polki jadau ornaments tailored to your exact budget, gold weight, and diamond specifications.\n• Share your dream design or sketch with our master goldsmiths for a free 3D CAD render and estimate.",
        link: {
          url: "https://wa.me/917717595732?text=Namaste%2C%20I%20am%20interested%20in%20a%20custom%20bridal%20jewellery%20consultation.",
          label: "Consult Master Jeweller on WhatsApp",
          isExternal: true,
        },
      };
    }

    // 7. Returns & Exchange
    if (
      query.includes("return") ||
      query.includes("refund") ||
      query.includes("exchange") ||
      query.includes("warranty") ||
      query.includes("buyback")
    ) {
      return {
        text: "🛡️ **Lifetime Purity & Exchange Assurance:**\n\n• **15-Day Inspection Guarantee:** Inspect your hallmarked jewellery upon delivery.\n• **100% Lifetime Buyback & Upgrade:** Exchange your Handa Jeweller gold and diamonds at prevailing market gold rates at any time across our boutiques.\n• Full certificate of authenticity and HUID card accompany every shipment.",
        link: {
          url: "/refund-policy",
          label: "View Returns & Buyback Policy",
          isExternal: false,
        },
      };
    }

    // 8. Contact & WhatsApp
    if (
      query.includes("contact") ||
      query.includes("phone") ||
      query.includes("whatsapp") ||
      query.includes("call") ||
      query.includes("support")
    ) {
      return {
        text: "📞 **Handa Jeweller Direct Support:**\n\n• **WhatsApp Support:** +91 77175 95732\n• **Official Email:** handaanmol073@gmail.com\n• **Boutique Phone:** +91 77175 95732\n\nOur team is available 10:00 AM – 8:00 PM IST to assist with orders, sizing, and VIP appointments.",
        link: {
          url: "https://wa.me/917717595732?text=Namaste%20Handa%20Jeweller%2C%20I%20need%20assistance.",
          label: "Chat on WhatsApp (+91 77175 95732)",
          isExternal: true,
        },
      };
    }

    // Default Fallback
    return {
      text: `Thank you for your inquiry about "${userInput}". As a certified fine jewelry atelier, we ensure every question receives master attention. You can choose one of the topics below or speak directly with our team on WhatsApp.`,
      options: [
        { label: "Today's Gold Rate", action: "gold_rate" },
        { label: "50% COD Terms", action: "cod_policy" },
        { label: "Store Address & Timings", action: "store_location" },
        { label: "Track My Order", action: "track_order" },
      ],
      link: {
        url: "https://wa.me/917717595732?text=" + encodeURIComponent(`Namaste Handa Jeweller! I have a question regarding: ${userInput}`),
        label: "Chat with Jeweller on WhatsApp",
        isExternal: true,
      },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(messageText);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        link: response.link,
        options: response.options,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleChipClick = (query: string) => {
    handleSendMessage(query);
  };

  const handleOptionClick = (action: string) => {
    handleSendMessage(action);
  };

  const handleResetChat = () => {
    setMessages([initialBotMessage]);
  };

  return (
    <>
      {/* Floating Chatbot Trigger Button (Stacked cleanly above the WhatsApp button) */}
      <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 print:hidden">
        {/* Tooltip Label */}
        <div
          className={`hidden sm:flex items-center gap-2 bg-neutral-900/95 text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-xl border border-neutral-700/80 transition-all duration-300 pointer-events-none ${
            isHovered && !isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Atelier Assistant &amp; FAQs</span>
        </div>

        {/* Distinct Luxury Chatbot Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen
              ? "bg-neutral-900 text-white rotate-90"
              : "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-amber-300 border-2 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20 hover:scale-105"
          }`}
          aria-label="Open Handa Jeweller Virtual Assistant"
          title="Handa Jeweller Virtual Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              {/* Gold notification dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-neutral-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
              <MessageSquare className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Luxury Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-24 right-4 sm:right-24 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E5DFD5] flex flex-col overflow-hidden animate-fadeIn print:hidden">
          {/* Header */}
          <div className="bg-[#1A1714] text-white px-5 py-4 flex items-center justify-between border-b border-amber-900/30">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-neutral-950 font-serif font-bold text-xs shadow-md border border-amber-300/40">
                HJ
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-900"></span>
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
                  Handa Jeweller Assistant
                </h4>
                <p className="text-[11px] text-amber-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Certified Gemologist Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Support Callout Ribbon */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>Official WhatsApp Support:</span>
            </div>
            <a
              href="https://wa.me/917717595732"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-0.5"
            >
              +91 77175 95732 <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#FAF8F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-neutral-900 text-white rounded-br-none"
                      : "bg-white text-neutral-800 border border-[#E8E2D7] rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{msg.text}</p>

                  {/* Inline Action Link */}
                  {msg.link && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-100">
                      {msg.link.isExternal ? (
                        <a
                          href={msg.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                        >
                          {msg.link.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          href={msg.link.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition"
                        >
                          {msg.link.label} <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Quick Option Buttons inside Bot Message */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.action}
                          onClick={() => handleOptionClick(opt.action)}
                          className="text-[10px] font-medium bg-[#F4EFE6] hover:bg-[#EAE2D5] text-neutral-800 px-2.5 py-1 rounded-full transition border border-[#DED7CA]"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E2D7] p-2.5 rounded-2xl rounded-bl-none w-16">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips (Horizontally Scrollable) */}
          <div className="px-3 py-2 bg-white border-t border-[#EAE4D9] overflow-x-auto flex gap-1.5 no-scrollbar flex-shrink-0">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.query)}
                className="whitespace-nowrap text-[10px] bg-[#FAF8F5] hover:bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full border border-[#DED7CA] transition flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Text Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#EAE4D9] flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about gold rates, 50% COD, orders..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#DED7CA] rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white w-9 h-9 rounded-xl flex items-center justify-center transition flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
