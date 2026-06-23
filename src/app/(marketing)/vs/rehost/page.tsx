import type { Metadata } from "next";
import VsRehostClient from "@/components/VsRehostClient";

export const metadata: Metadata = {
  title: "hostfa.st vs rehost.it — 2x Cheaper Hosting Alternative",
  description:
    "Compare hostfa.st vs rehost.it. hostfa.st starts at $3/month for 1 site (or $1.90/month on bulk plan) vs rehost.it starting at $11.99/month (2 sites plan).",
  alternates: {
    canonical: "https://hostfa.st/vs/rehost",
  },
  openGraph: {
    title: "hostfa.st vs rehost.it — 2x Cheaper Hosting Alternative",
    description:
      "Compare hostfa.st vs rehost.it. hostfa.st starts at $3/month for 1 site (or $1.90/month on bulk plan) vs rehost.it starting at $11.99/month (2 sites plan).",
    url: "https://hostfa.st/vs/rehost",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hostfa.st vs rehost.it — 2x Cheaper Hosting Alternative",
    description:
      "Compare hostfa.st vs rehost.it. hostfa.st starts at $3/month for 1 site (or $1.90/month on bulk plan) vs rehost.it starting at $11.99/month (2 sites plan).",
  },
};

export default function VsRehostPage() {
  const vsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/vs/rehost",
        "url": "https://hostfa.st/vs/rehost",
        "name": "hostfa.st vs rehost.it Hosting",
        "description":
          "Compare hostfa.st vs rehost.it. hostfa.st starts at $3/month for 1 site (or $1.90/month on bulk plan) vs rehost.it starting at $11.99/month (2 sites plan).",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/vs/rehost#breadcrumb",
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
            "item": "https://hostfa.st/vs/rehost",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "vs rehost.it",
            "item": "https://hostfa.st/vs/rehost",
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
      <VsRehostClient />
    </>
  );
}
