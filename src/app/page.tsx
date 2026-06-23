import type { Metadata } from "next";
import LandingPageClient from "@/components/LandingPageClient";

export const metadata: Metadata = {
  title: "hostfa.st — Host Your Framer Site for $3/month",
  description:
    "Keep designing in Framer. We automatically deploy your site to your own domain for $3/month. Auto-syncs on every publish. No manual exports. Cancel anytime.",
  keywords: [
    "framer hosting",
    "framer alternative",
    "cheap framer hosting",
    "framer custom domain",
    "framer site host",
    "host framer site",
  ],
  alternates: {
    canonical: "https://hostfa.st",
  },
  openGraph: {
    title: "hostfa.st — Host Your Framer Site for $3/month",
    description:
      "Auto-deploy your Framer site to your custom domain. $3/month. No Framer paid plan needed.",
    url: "https://hostfa.st",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hostfa.st — Host Your Framer Site for $3/month",
    description: "Keep designing in Framer. We host it for $3/month.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "hostfa.st",
    "description": "Framer site hosting for $3/month with auto-sync",
    "applicationCategory": "WebApplication",
    "offers": {
      "@type": "Offer",
      "price": "3.00",
      "priceCurrency": "USD",
      "priceValidUntil": "2027-01-01",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient />
    </>
  );
}
