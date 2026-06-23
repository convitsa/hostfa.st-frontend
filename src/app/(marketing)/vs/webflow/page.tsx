import type { Metadata } from "next";
import VsWebflowClient from "@/components/VsWebflowClient";

export const metadata: Metadata = {
  title: "hostfa.st vs Webflow Hosting — Cheaper Alternative",
  description:
    "Webflow charges $15-39/month for hosting. hostfa.st hosts your Webflow-exported site for $3/month with auto-sync.",
  alternates: {
    canonical: "https://hostfa.st/vs/webflow",
  },
  openGraph: {
    title: "hostfa.st vs Webflow Hosting — Cheaper Alternative",
    description:
      "Webflow charges $15-39/month for hosting. hostfa.st hosts your Webflow-exported site for $3/month with auto-sync.",
    url: "https://hostfa.st/vs/webflow",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hostfa.st vs Webflow Hosting — Cheaper Alternative",
    description:
      "Webflow charges $15-39/month for hosting. hostfa.st hosts your Webflow-exported site for $3/month with auto-sync.",
  },
};

export default function VsWebflowPage() {
  const vsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://hostfa.st/vs/webflow",
        "url": "https://hostfa.st/vs/webflow",
        "name": "hostfa.st vs Webflow Hosting",
        "description":
          "Webflow charges $15-39/month for hosting. hostfa.st hosts your Webflow-exported site for $3/month with auto-sync.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hostfa.st/vs/webflow#breadcrumb",
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
            "item": "https://hostfa.st/vs/webflow",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "vs Webflow",
            "item": "https://hostfa.st/vs/webflow",
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
      <VsWebflowClient />
    </>
  );
}
