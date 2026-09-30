import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Award, Heart, Crown, HelpCircle } from "lucide-react";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/seo/JsonLd";

export const metadata = {
  title: "About Handa Jeweller | Four Decades of Punjabi Goldsmith Heritage Since 1982",
  description:
    "Explore the four-decade legacy of Handa Jeweller. Founded in 1982, crafting certified 22K BIS 916 hallmarked gold, GIA solitaires, and royal bridal polki in Talwara and Amritsar, Punjab.",
  alternates: {
    canonical: "https://handajeweller.com/about",
  },
  openGraph: {
    title: "About Handa Jeweller | Four Decades of Goldsmith Heritage",
    description: "Our atelier story: from traditional Punjabi bench goldsmithing in 1982 to certified global fine jewelry.",
    url: "https://handajeweller.com/about",
  },
};

const ABOUT_FAQS = [
  {
    question: "When was Handa Jeweller established?",
    answer:
      "Handa Jeweller was founded in 1982 in Talwara, Punjab. For more than four decades, our family-owned atelier has specialized in certified 22K (916) pure gold ornaments, natural solitaires, and heirloom Polki bridal trousseau.",
  },
  {
    question: "Who designs and crafts Handa Jeweller ornaments?",
    answer:
      "Our collections are overseen by principal goldsmith and gemologist Anmol Handa, working alongside hereditary Punjabi and Rajasthani artisan guilds specializing in Jadau, Bikaneri Meenakari, and laser hallmarked gold casting.",
  },
  {
    question: "What certifications accompany Handa Jeweller purchases?",
    answer:
      "Every gold jewel carries official Bureau of Indian Standards (BIS) 916 hallmarking with an individual 6-digit laser HUID. Natural diamond solitaires are independently graded and sealed by GIA or IGI with serial laser inscriptions.",
  },
];

export default function AboutPage() {
  const baseUrl = "https://handajeweller.com";

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "About Atelier", url: `${baseUrl}/about` },
        ]}
      />
      <FAQPageSchema faqs={ABOUT_FAQS} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#4A0E17]">Home</Link>
          <span>/</span>
          <span className="text-[#1A1615] font-semibold">About Atelier</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest border border-[#4A0E17]/20">
            <Crown className="w-3.5 h-3.5 text-[#C5A059]" /> Established in 1982
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1615] tracking-tight">
            Four Decades of Royal Elegance &amp; Trust
          </h1>
          <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed">
            Founded in Talwara, Punjab, Handa Jeweller has been the premier destination for patrons and brides seeking 100% BIS 916 hallmarked pure gold, GIA certified solitaires, and heirloom bridal polki suites.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/8] rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD3]">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop"
            alt="Handa Jeweller Master Craftsmanship"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Founder & Craftsmanship Story (E-E-A-T) */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-4 text-[#2A2421] text-xs sm:text-sm leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1615]">
              The Atelier Philosophy: Heritage Meets Traceability
            </h2>
            <p>
              In 1982, Handa Jeweller opened its doors with a single foundational vow: to treat every piece of gold not as a commercial commodity, but as a generational family blessing. Over forty years later, that sacred goldsmithing code remains unwavering across our flagship boutiques in Talwara and Amritsar.
            </p>
            <p>
              Led by master goldsmith <strong>Anmol Handa</strong>, our team pairs ancient hand-chiseled Jadau Polki setting techniques with state-of-the-art XRF spectroscopy assaying. We believe true luxury requires radical purity transparency: every piece we deliver bears the government-backed 6-digit laser HUID code verifiable in seconds on the BIS Care mobile application.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#8C6D23] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1615]">Uncompromising Purity</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              Every gram of gold is certified 22K (916) BIS hallmarked with 6-digit laser HUID, guaranteed with 100% lifetime buyback value.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#8C6D23] flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1615]">Ethical Solitaires</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              All natural diamonds are conflict-free Kimberley Process certified, cut to ideal optical proportions, and graded by GIA or IGI.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#8C6D23] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1615]">Heirloom Heritage</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              Engineered not merely for a single wedding day, but to endure as cherished heirlooms passed down lovingly from mother to daughter.
            </p>
          </div>
        </div>

        {/* About FAQ Section */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#4A0E17]">
            <HelpCircle className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1615]">
              Frequently Asked Questions About Our Atelier
            </h2>
          </div>
          <div className="space-y-4 divide-y divide-neutral-100">
            {ABOUT_FAQS.map((faq, i) => (
              <div key={i} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="font-serif text-base font-bold text-[#1A1615]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A524C] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
