import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api", "/sites", "/billing"],
    },
    sitemap: "https://hostfa.st/sitemap.xml",
  };
}
