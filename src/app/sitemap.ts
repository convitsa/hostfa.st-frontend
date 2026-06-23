import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hostfa.st";

  const entries = [
    { route: "", changeFrequency: "weekly", priority: 1.0 },
    { route: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { route: "/framer-hosting-alternative", changeFrequency: "monthly", priority: 0.9 },
    { route: "/vs/framer", changeFrequency: "monthly", priority: 0.8 },
    { route: "/vs/webflow", changeFrequency: "monthly", priority: 0.7 },
    { route: "/vs/rehost", changeFrequency: "monthly", priority: 0.7 },
    { route: "/tools/framer-export", changeFrequency: "weekly", priority: 0.8 },
    { route: "/tools/cost-calculator", changeFrequency: "monthly", priority: 0.7 },
    { route: "/tools/speed-test", changeFrequency: "monthly", priority: 0.7 },
    { route: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { route: "/blog/host-framer-site-cheap", changeFrequency: "monthly", priority: 0.6 },
    { route: "/blog/framer-vs-webflow-hosting-cost", changeFrequency: "monthly", priority: 0.6 },
    { route: "/blog/framer-free-plan-guide", changeFrequency: "monthly", priority: 0.6 },
    { route: "/login", changeFrequency: "yearly", priority: 0.3 },
    { route: "/register", changeFrequency: "yearly", priority: 0.5 },
  ];

  return entries.map((entry) => ({
    url: `${baseUrl}${entry.route}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency as "weekly" | "monthly" | "yearly",
    priority: entry.priority,
  }));
}

