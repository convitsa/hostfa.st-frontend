import type { Metadata } from "next";
import PricingPageClient from "@/components/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing — hostfa.st | Framer Hosting from $3/month",
  description:
    "Simple, honest pricing for Framer site hosting. Starter $3/mo, Pro $8/mo, Scale $19/mo. Annual plans save 2 months. Cancel anytime.",
  alternates: {
    canonical: "https://hostfa.st/pricing",
  },
  openGraph: {
    title: "Pricing — hostfa.st | Framer Hosting from $3/month",
    description:
      "Simple, honest pricing for Framer site hosting. Starter $3/mo, Pro $8/mo, Scale $19/mo. Annual plans save 2 months. Cancel anytime.",
    url: "https://hostfa.st/pricing",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — hostfa.st | Framer Hosting from $3/month",
    description:
      "Simple, honest pricing for Framer site hosting. Starter $3/mo, Pro $8/mo, Scale $19/mo. Annual plans save 2 months. Cancel anytime.",
  },
};

export default function PricingPage() {
  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "hostfa.st Hosting Plans",
    "image": "https://hostfa.st/og-image.png",
    "description": "Simple, honest pricing for Framer site hosting.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "2.50",
      "highPrice": "19.00",
      "offerCount": "3",
      "offers": [
        {
          "@type": "Offer",
          "name": "Starter Plan",
          "price": "3.00",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "3.00",
            "priceCurrency": "USD",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON",
            },
          },
        },
        {
          "@type": "Offer",
          "name": "Pro Plan",
          "price": "8.00",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "8.00",
            "priceCurrency": "USD",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON",
            },
          },
        },
        {
          "@type": "Offer",
          "name": "Scale Plan",
          "price": "19.00",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "19.00",
            "priceCurrency": "USD",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingPageClient />
    </>
  );
}
