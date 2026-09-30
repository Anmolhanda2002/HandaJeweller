import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Crown,
  HelpCircle,
  Share2,
} from "lucide-react";
import { BLOG_ARTICLES } from "@/lib/data/blogArticles";
import {
  ArticleSchema,
  BreadcrumbSchema,
  FAQPageSchema,
} from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Guide Not Found" };

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `https://handajeweller.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://handajeweller.com/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.featuredImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const baseUrl = "https://handajeweller.com";
  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <article className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      {/* Schema Injections */}
      <ArticleSchema
        title={article.title}
        description={article.metaDescription}
        url={`${baseUrl}/blog/${article.slug}`}
        image={article.featuredImage}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        authorName={article.author.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Knowledge Hub", url: `${baseUrl}/blog` },
          { name: article.title, url: `${baseUrl}/blog/${article.slug}` },
        ]}
      />
      {article.faqs && article.faqs.length > 0 && (
        <FAQPageSchema faqs={article.faqs} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#4A0E17] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#4A0E17] transition">
            Knowledge Hub
          </Link>
          <span>/</span>
          <span className="text-[#1A1615] font-medium truncate max-w-xs">
            {article.category}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-block bg-[#4A0E17] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1615] tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author Byline & E-E-A-T Credentials */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-[#EAE2D5] py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 border border-[#C5A059]">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#1A1615]">
                    {article.author.name}
                  </span>
                  <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#8C6D23] font-medium">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                Updated:{" "}
                {new Date(article.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                {article.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md border border-[#E7DFD3]">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-6 sm:p-12 shadow-sm space-y-6 text-[#2A2421] leading-relaxed text-sm sm:text-base">
          <div
            className="prose prose-neutral max-w-none space-y-4"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/^### (.*$)/gim, '<h3 class="font-serif text-xl sm:text-2xl font-bold text-[#1A1615] mt-6 mb-2">$1</h3>')
                .replace(/^#### (.*$)/gim, '<h4 class="font-serif text-lg font-bold text-[#4A0E17] mt-4 mb-1">$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#1A1615]">$1</strong>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#8C6D23] underline font-semibold hover:text-[#4A0E17]">$1</a>')
                .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-sm text-[#5A524C]">$1</li>')
                .replace(/\n\n/g, '<p class="mt-3 text-sm sm:text-base leading-relaxed text-[#4A423D]"></p>')
            }}
          />
        </div>

        {/* FAQ Section */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="bg-white rounded-3xl border border-[#E7DFD3] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-[#4A0E17]">
              <HelpCircle className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-2xl font-bold text-[#1A1615]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4 divide-y divide-neutral-100">
              {article.faqs.map((faq, idx) => (
                <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-[#1A1615]">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A524C] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Atelier CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#4A0E17] to-[#2D080E] text-white p-8 sm:p-10 shadow-xl border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Certified Assurance
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Consult with Handa Jeweller Master Craftsmen
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Need custom bridal trousseau sizing, custom GIA solitaire selection, or live gold rate lock? Connect directly with our atelier on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/917717595732?text=Namaste%2C%20I%20read%20your%20jewellery%20guide%20and%20would%20like%20expert%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#1A1615] font-bold text-xs uppercase tracking-wider transition shadow-md whitespace-nowrap"
          >
            Chat with Concierge →
          </a>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="font-serif text-xl font-bold text-[#1A1615]">
              Related Master Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-4 rounded-2xl bg-white border border-[#E7DFD3] hover:border-[#C5A059] transition flex items-center gap-3.5 group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={rel.featuredImage}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C6D23] uppercase font-bold">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1615] group-hover:text-[#4A0E17] transition line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
