import type { Metadata } from "next";
import VsFramerClient from "@/components/VsFramerClient";

export const metadata: Metadata = {
  title: "hostfa.st vs Framer Hosting — Save $100+/year",
  description:
    "Detailed comparison of hostfa.st vs Framer hosting. Same features, 5x cheaper. Auto-sync, custom domain, SSL included.",
  alternates: {
    canonical: "https://hostfa.st/vs/framer",
  },
  openGraph: {
    title: "hostfa.st vs Framer Hosting — Save $100+/year",
    description:
      "Detailed comparison of hostfa.st vs Framer hosting. Same features, 5x cheaper. Auto-sync, custom domain, SSL included.",
    url: "https://hostfa.st/vs/framer",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hostfa.st vs Framer Hosting — Save $100+/year",
    description:
      "Detailed comparison of hostfa.st vs Framer hosting. Same features, 5x cheaper. Auto-sync, custom domain, SSL included.",
  },
};

export default function VsFramerPage() {
  const vsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/vs/framer",
        "url": "https://hostfa.st/vs/framer",
        "name": "hostfa.st vs Framer Hosting",
        "description":
          "Detailed comparison of hostfa.st vs Framer hosting. Same features, 5x cheaper. Auto-sync, custom domain, SSL included.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/vs/framer#breadcrumb",
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
            "name": "Compare",
            "item": "https://hostfa.st/vs/framer",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "vs Framer",
            "item": "https://hostfa.st/vs/framer",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vsJsonLd) }}
      />
      <VsFramerClient />
    </>
  );
}
