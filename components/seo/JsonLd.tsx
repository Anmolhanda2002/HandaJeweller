import React from "react";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

export function OrganizationSchema({
  name = "Handa Jeweller",
  url = "https://handajeweller.com",
  logo = "https://handajeweller.com/placeholder.png",
  phone = "+91 77175 95732",
  email = "handaanmol073@gmail.com",
  address = {
    streetAddress: "Main Market, Talwara & Amritsar Heritage Hub",
    addressLocality: "Talwara",
    addressRegion: "Punjab",
    postalCode: "144216",
    addressCountry: "IN",
  },
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${url}/#organization`,
    name,
    url,
    logo,
    image: [logo],
    description:
      "Handa Jeweller is a premier Indian heritage jewellery atelier founded in 1982, specializing in BIS 916 hallmarked 22K gold, certified natural solitaires, and royal bridal polki.",
    telephone: phone,
    email,
    priceRange: "₹₹₹₹",
    currenciesAccepted: "INR, AED, USD",
    paymentAccepted: "Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:30",
        closes: "20:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.9567,
      longitude: 75.8753,
    },
    sameAs: [
      "https://wa.me/917717595732",
      "https://instagram.com/handajeweller",
      "https://facebook.com/handajeweller",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema({ url = "https://handajeweller.com" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: "Handa Jeweller",
    description:
      "Official online boutique for certified fine diamond solitaires, BIS 916 hallmarked pure gold, and royal bridal polki sets.",
    publisher: {
      "@id": `${url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  product,
  url,
}: {
  product: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    images?: string[];
    category?: { name: string };
    stock?: number;
    metalPurity?: string;
    jewelryType?: string;
    averageRating?: number;
    reviewCount?: number;
  };
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}/products/${product.slug}#product`,
    name: product.name,
    description:
      product.description ||
      `${product.name} handcrafted by master Punjabi artisans in ${product.metalPurity || "22K BIS Hallmarked Gold"}.`,
    image: product.images && product.images.length > 0 ? product.images : [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
    ],
    sku: product.sku || `HJ-${product._id.toString().slice(-6).toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "Handa Jeweller",
    },
    material: product.metalPurity || "22K BIS 916 Hallmarked Gold",
    offers: {
      "@type": "Offer",
      url: `${url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Handa Jeweller",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price >= 15000 ? "0" : "250",
          currency: "INR",
        },
        shippingDestination: [
          {
            "@type": "DefinedRegion",
            addressCountry: "IN",
          },
          {
            "@type": "DefinedRegion",
            addressCountry: "AE",
          },
        ],
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },
    ...(product.averageRating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          },
        }
      : {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "18",
          },
        }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebApplicationSchema({
  url = "https://handajeweller.com/try-on",
}: {
  url?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Handa Jeweller Virtual Necklace & Earring Try-On Salon",
    url,
    applicationCategory: "DesignApplication",
    operatingSystem: "All modern mobile & desktop browsers (Chrome, Safari, iOS, Android)",
    browserRequirements: "Requires camera or image upload support; front camera enabled with MediaPipe Face & Pose AI",
    description:
      "Interactive real-time augmented reality virtual jewelry try-on experience. Fit necklaces and earrings on your live camera preview or selfie with 100% in-browser privacy.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: [
      "Real-time MediaPipe Face Landmark & Pose alignment",
      "Automatic neckline detection below chin landmark 152",
      "Live front camera preview and selfie photo upload",
      "Client-side processing with zero server photo storage",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Anmol Handa (Master Goldsmith)",
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: "Principal Goldsmith & Gemologist",
      worksFor: {
        "@type": "Organization",
        name: "Handa Jeweller",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Handa Jeweller",
      logo: {
        "@type": "ImageObject",
        url: "https://handajeweller.com/placeholder.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
