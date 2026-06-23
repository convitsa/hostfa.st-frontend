import type { Metadata } from "next";
import CostCalculatorClient from "@/components/CostCalculatorClient";

export const metadata: Metadata = {
  title: "Framer Hosting Cost Calculator — How Much Are You Overpaying?",
  description:
    "Calculate your Framer hosting costs vs hostfa.st. See exactly how much you save by switching.",
  alternates: {
    canonical: "https://hostfa.st/tools/cost-calculator",
  },
  keywords: [
    "framer hosting cost",
    "framer pricing calculator",
    "how much does framer cost",
    "framer subscription cost"
  ],
  openGraph: {
    title: "Framer Hosting Cost Calculator — How Much Are You Overpaying?",
    description:
      "Calculate your Framer hosting costs vs hostfa.st. See exactly how much you save by switching.",
    url: "https://hostfa.st/tools/cost-calculator",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Framer Hosting Cost Calculator — How Much Are You Overpaying?",
    description:
      "Calculate your Framer hosting costs vs hostfa.st. See exactly how much you save by switching.",
  },
};

export default function CostCalculatorPage() {
  const toolsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/tools/cost-calculator",
        "url": "https://hostfa.st/tools/cost-calculator",
        "name": "Framer Hosting Cost Calculator — How Much Are You Overpaying?",
        "description":
          "Calculate your Framer hosting costs vs hostfa.st. See exactly how much you save by switching.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/tools/cost-calculator#breadcrumb",
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
            "item": "https://hostfa.st/tools/cost-calculator",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Cost Calculator",
            "item": "https://hostfa.st/tools/cost-calculator",
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
      <CostCalculatorClient />
    </>
  );
}
