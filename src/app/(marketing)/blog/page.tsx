import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import type { Metadata } from "next";

import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Blog — hostfa.st | Framer Hosting Tips & Guides",
  description: "Tips, guides, and tutorials for Framer users. Learn how to save money on hosting and optimize your Framer site.",
  alternates: {
    canonical: "https://hostfa.st/blog",
  },
  openGraph: {
    title: "Blog — hostfa.st | Framer Hosting Tips & Guides",
    description: "Tips, guides, and tutorials for Framer users. Learn how to save money on hosting and optimize your Framer site.",
    url: "https://hostfa.st/blog",
    siteName: "hostfa.st",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — hostfa.st | Framer Hosting Tips & Guides",
    description: "Tips, guides, and tutorials for Framer users. Learn how to save money on hosting and optimize your Framer site.",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

export default function BlogIndexPage() {
  const blogDir = path.join(process.cwd(), "content/blog");
  let posts: BlogPost[] = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    posts = files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map((file) => {
        const filePath = path.join(blogDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        return {
          slug: data.slug || file.replace(/\.mdx?$/, ""),
          title: data.title || "Untitled Post",
          description: data.description || "",
          date: data.date || "",
          readingTime: data.readingTime || "1 min",
        };
      });

    // Sort posts by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#EDEDED] selection:text-[#0A0A0A] flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 h-12 bg-[#0A0A0A]/80 backdrop-blur border-b border-[#222] z-50 flex items-center justify-between px-4 md:px-8">
          <Link href="/" className="font-mono font-semibold text-sm text-[#EDEDED] tracking-tight hover:opacity-85 select-none">
            hostfa.st
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-[#888] hover:text-[#EDEDED] px-3 py-1.5 transition-colors font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-xs bg-[#EDEDED] text-[#0A0A0A] hover:bg-white px-3 py-1.5 rounded-sm transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* HEADER */}
        <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[#EDEDED] leading-[1.1] font-bold tracking-tight mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
            Blog
          </h1>
          <p className="text-sm md:text-base text-[#888] max-w-xl mx-auto leading-relaxed">
            Guides and tips for Framer users
          </p>
        </header>

        {/* ARTICLE LIST */}
        <main className="max-w-2xl mx-auto px-4 pb-24">
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-[#111] border border-[#222] rounded-lg p-5 hover:border-[#333] transition-colors duration-200 group"
              >
                <h2 className="text-base font-medium text-[#EDEDED] group-hover:text-white transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[#888] mt-1 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#555] mt-3 font-mono">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </Link>
            ))}
            {posts.length === 0 && (
              <p className="text-center text-sm text-[#555] py-12">No posts found.</p>
            )}
          </div>
        </main>
      </div>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
