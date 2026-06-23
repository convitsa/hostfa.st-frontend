import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/marketing/Footer";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  return {
    title: `${data.title} — hostfa.st`,
    description: data.description,
    alternates: {
      canonical: `https://hostfa.st/blog/${slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://hostfa.st/blog/${slug}`,
      siteName: "hostfa.st",
      type: "article",
      publishedTime: data.date,
      authors: ["hostfa.st Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  // Load the compiled MDX component dynamically
  let PostContent;
  try {
    const mdxModule = await import(`../../../../../content/blog/${slug}.mdx`);
    PostContent = mdxModule.default;
  } catch (err) {
    console.error("Failed to dynamically import MDX content:", err);
    notFound();
  }

  const postJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "datePublished": data.date,
        "author": {
          "@type": "Person",
          "name": "hostfa.st Team",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://hostfa.st/blog/${slug}#breadcrumb`,
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
            "name": "Blog",
            "item": "https://hostfa.st/blog",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": data.title,
            "item": `https://hostfa.st/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#EDEDED] selection:text-[#0A0A0A] flex flex-col justify-between overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

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

        {/* LAYOUT CONTAINER */}
        <main className="max-w-2xl mx-auto px-4 py-12 pt-28 pb-24">
          {/* Back link */}
          <Link
            href="/blog"
            className="text-xs text-[#555] hover:text-[#888] transition-colors font-mono"
          >
            ← Blog
          </Link>

          {/* Post Header */}
          <header className="mt-6">
            <h1 className="text-2xl font-semibold text-[#EDEDED] tracking-tight leading-tight">
              {data.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#555] mt-2 font-mono">
              <span>{data.date}</span>
              <span>•</span>
              <span>{data.readingTime}</span>
            </div>
          </header>

          {/* Divider */}
          <hr className="border-t border-[#222] mt-6 mb-8" />

          {/* Article Body */}
          <article className="prose prose-invert max-w-none">
            <PostContent />
          </article>

          {/* Bottom CTA Box */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6 mt-12 hover:border-[#333] transition-colors duration-200">
            <h3 className="text-base font-medium text-[#EDEDED]">
              Ready to host your Framer site for $3/month?
            </h3>
            <p className="text-sm text-[#888] mt-1">
              Keep designing in Framer. We handle the rest.
            </p>
            <Link
              href="/register"
              className="inline-flex bg-[#EDEDED] text-[#0A0A0A] hover:bg-white active:scale-[0.98] transition-all font-semibold text-xs h-9 px-4 rounded-md items-center justify-center mt-4 cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>
        </main>
      </div>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
