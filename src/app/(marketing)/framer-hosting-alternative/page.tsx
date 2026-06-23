import type { Metadata } from "next";
import FramerHostingAlternativeClient from "@/components/FramerHostingAlternativeClient";

export const metadata: Metadata = {
  title: "Framer Hosting Alternative — Host Your Framer Site for $3/month",
  description:
    "Looking for a cheaper alternative to Framer hosting? hostfa.st deploys your Framer site to your custom domain for $3/month with auto-sync. No Framer paid plan needed.",
  alternates: {
    canonical: "https://hostfa.st/framer-hosting-alternative",
  },
  openGraph: {
    title: "Framer Hosting Alternative — Host Your Framer Site for $3/month",
    description:
      "Looking for a cheaper alternative to Framer hosting? hostfa.st deploys your Framer site to your custom domain for $3/month with auto-sync. No Framer paid plan needed.",
    url: "https://hostfa.st/framer-hosting-alternative",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Framer Hosting Alternative — Host Your Framer Site for $3/month",
    description:
      "Looking for a cheaper alternative to Framer hosting? hostfa.st deploys your Framer site to your custom domain for $3/month with auto-sync. No Framer paid plan needed.",
  },
};

export default function FramerHostingAlternativePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is hostfa.st a Framer replacement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — you still design in Framer. We only replace Framer's hosting.",
        },
      },
      {
        "@type": "Question",
        "name": "Do I lose any Framer features?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You keep all design features. You only lose Framer's hosting badge.",
        },
      },
      {
        "@type": "Question",
        "name": "How long does migration take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Less than 5 minutes. Paste URL, add CNAME, done.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FramerHostingAlternativeClient />
    </>
  );
}
