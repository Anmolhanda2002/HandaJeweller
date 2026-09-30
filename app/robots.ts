import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://handajeweller.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/account/",
          "/api/",
          "/search",
          "/admin",
          "/*?*sort=",
          "/*?*minPrice=",
        ],
      },
      {
        // Explicitly welcome AI and Generative Search Crawlers for GEO
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "Applebot-Extended",
        ],
        allow: [
          "/",
          "/shop",
          "/products/",
          "/category/",
          "/try-on",
          "/about",
          "/contact",
          "/blog/",
          "/locations/",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/cart", "/checkout", "/account/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
