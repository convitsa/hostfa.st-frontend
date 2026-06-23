import type { Metadata } from "next";
import FramerExportClient from "@/components/FramerExportClient";

export const metadata: Metadata = {
  title: "Free Framer Site Exporter — Download Your Framer Site as HTML",
  description:
    "Export any Framer site to HTML/CSS/JS for free. Download as ZIP or deploy to your domain with hostfa.st for $3/month.",
  alternates: {
    canonical: "https://hostfa.st/tools/framer-export",
  },
  keywords: [
    "framer export",
    "export framer site",
    "framer to html",
    "download framer site",
    "framer static export"
  ],
  openGraph: {
    title: "Free Framer Site Exporter — Download Your Framer Site as HTML",
    description:
      "Export any Framer site to HTML/CSS/JS for free. Download as ZIP or deploy to your domain with hostfa.st for $3/month.",
    url: "https://hostfa.st/tools/framer-export",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Framer Site Exporter — Download Your Framer Site as HTML",
    description:
      "Export any Framer site to HTML/CSS/JS for free. Download as ZIP or deploy to your domain with hostfa.st for $3/month.",
  },
};

export default function FramerExportPage() {
  const toolsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/tools/framer-export",
        "url": "https://hostfa.st/tools/framer-export",
        "name": "Free Framer Site Exporter — Download Your Framer Site as HTML",
        "description":
          "Export any Framer site to HTML/CSS/JS for free. Download as ZIP or deploy to your domain with hostfa.st for $3/month.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/tools/framer-export#breadcrumb",
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
            "item": "https://hostfa.st/tools/framer-export",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Framer Exporter",
            "item": "https://hostfa.st/tools/framer-export",
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
      <FramerExportClient />
    </>
  );
}
