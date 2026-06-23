import type { Metadata } from "next";
import SpeedTestClient from "@/components/SpeedTestClient";

export const metadata: Metadata = {
  title: "Framer Site Speed Test — Check Your Core Web Vitals",
  description:
    "Test your Framer site's loading speed and Core Web Vitals. See if slow hosting is hurting your SEO and conversions.",
  alternates: {
    canonical: "https://hostfa.st/tools/speed-test",
  },
  keywords: [
    "framer site speed",
    "framer performance",
    "framer core web vitals",
    "framer site slow",
    "test framer speed"
  ],
  openGraph: {
    title: "Framer Site Speed Test — Check Your Core Web Vitals",
    description:
      "Test your Framer site's loading speed and Core Web Vitals. See if slow hosting is hurting your SEO and conversions.",
    url: "https://hostfa.st/tools/speed-test",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Framer Site Speed Test — Check Your Core Web Vitals",
    description:
      "Test your Framer site's loading speed and Core Web Vitals. See if slow hosting is hurting your SEO and conversions.",
  },
};

export default function SpeedTestPage() {
  const toolsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/tools/speed-test",
        "url": "https://hostfa.st/tools/speed-test",
        "name": "Framer Site Speed Test — Check Your Core Web Vitals",
        "description":
          "Test your Framer site's loading speed and Core Web Vitals. See if slow hosting is hurting your SEO and conversions.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/tools/speed-test#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://hostfa.st",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://hostfa.st/tools/speed-test",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Speed Test",
            "item": "https://hostfa.st/tools/speed-test",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsJsonLd) }}
      />
      <SpeedTestClient />
    </>
  );
}
