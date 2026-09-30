import React from "react";
import type { Metadata } from "next";
import {
  WebApplicationSchema,
  BreadcrumbSchema,
  FAQPageSchema,
} from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Virtual Jewellery Try-On Online | Real-Time AI Camera & Photo Try-On | Handa Jeweller",
  description:
    "Try on 22K gold necklaces, royal polki chokers, and diamond earrings online with your camera or selfie photo. Real-time MediaPipe AI vision with 100% in-browser privacy.",
  alternates: {
    canonical: "https://handajeweller.com/try-on",
  },
  openGraph: {
    title: "Virtual Necklace & Earring Try-On Salon | Handa Jeweller",
    description:
      "Instant augmented reality jewelry try-on with real-time face & neckline detection. See heirloom necklaces on your neck before buying.",
    url: "https://handajeweller.com/try-on",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Handa Jeweller Virtual Try-On Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Jewellery Try-On | Handa Jeweller",
    description: "Try necklaces and earrings online on your live camera preview.",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200"],
  },
};

const TRY_ON_FAQS = [
  {
    question: "How does the virtual jewelry try-on work?",
    answer:
      "Our virtual try-on uses browser-based MediaPipe AI computer vision. It locates your chin landmark (landmark 152) and shoulder line (landmarks 11 and 12) to automatically scale, rotate, and drape the necklace naturally across your collarbone.",
  },
  {
    question: "Are my camera photos or video recordings saved on your servers?",
    answer:
      "No. All computer vision calculations and video canvas rendering occur 100% locally inside your device browser. No photos, video feeds, or biometric facial vectors are ever transmitted to or stored on any server.",
  },
  {
    question: "Can I try on jewelry using an uploaded selfie instead of a live webcam?",
    answer:
      "Yes. If you prefer not to enable your camera, you can upload any high-resolution front-facing selfie portrait. The system will detect your face landmarks and position the jewellery accordingly.",
  },
  {
    question: "Is the virtual try-on free to use?",
    answer:
      "Yes, the Handa Jeweller Virtual Try-On Salon is completely free and requires no account creation, subscription, or software installation.",
  },
];

export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = "https://handajeweller.com";

  return (
    <>
      <WebApplicationSchema url={`${baseUrl}/try-on`} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Virtual Try-On Salon", url: `${baseUrl}/try-on` },
        ]}
      />
      <FAQPageSchema faqs={TRY_ON_FAQS} />
      {children}
    </>
  );
}
