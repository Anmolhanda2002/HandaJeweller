import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { BLOG_ARTICLES, CONTENT_CALENDAR_12_TOPICS } from "@/lib/data/blogArticles";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Fine Jewellery Knowledge Hub & Buying Guides | Handa Jeweller",
  description:
    "Authoritative fine jewellery guides by master Punjabi goldsmiths. Learn about 22K BIS 916 hallmarking, GIA solitaires, Polki vs Kundan differences, and care protocols.",
  alternates: {
    canonical: "https://handajeweller.com/blog",
  },
  openGraph: {
    title: "Handa Jeweller Knowledge Hub & Royal Bridal Guides",
    description: "Deep-dive guides on hallmarked gold, diamond solitaires, Polki bridal suites, and jewellery care.",
    url: "https://handajeweller.com/blog",
  },
};

export default function BlogHubPage() {
  const baseUrl = "https://handajeweller.com";

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Jewellery Knowledge Hub", url: `${baseUrl}/blog` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest border border-[#4A0E17]/20">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" /> The Goldsmith&apos;s Gazette
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1615] tracking-tight">
            Fine Jewellery Knowledge &amp; Buying Guides
          </h1>
          <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed">
            Written with four decades of bench goldsmith heritage. Impartial, verifiable advice on BIS 916 gold purity, GIA diamonds, heirloom Polki jadau, and lifelong jewellery care.
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-3xl border border-[#E7DFD3] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#4A0E17] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-[#1A1615] group-hover:text-[#4A0E17] transition leading-snug line-clamp-2">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>

                  <p className="text-xs text-[#5A524C] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1A1615]">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-bold text-[#8C6D23] hover:text-[#4A0E17] flex items-center gap-1 uppercase tracking-wider transition"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Calendar Showcase */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8C6D23] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> 3-Month Editorial Roadmap
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1615] mt-1">
                Upcoming Connoisseur Masterclasses &amp; Care Protocols
              </h3>
            </div>
            <span className="text-xs text-neutral-500 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#EAE2D5]">
              12 Published &amp; Scheduled Editions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTENT_CALENDAR_12_TOPICS.map((monthPlan, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D5] space-y-3"
              >
                <h4 className="text-xs font-bold text-[#4A0E17] uppercase tracking-wider pb-2 border-b border-[#EAE2D5]">
                  {monthPlan.month}
                </h4>
                <ul className="space-y-3">
                  {monthPlan.articles.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-semibold text-neutral-600">{item.week}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                          {item.status}
                        </span>
                      </div>
                      <p className="font-medium text-[#1A1615] leading-snug line-clamp-2">
                        {item.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
