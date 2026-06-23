import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#222] py-12 px-4 md:px-8 bg-[#080808] mt-20 w-full">
      <div className="max-w-5xl mx-auto">
        {/* Grid Layout: 4 columns desktop, 2 columns mobile, stack on small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1 - Brand */}
          <div className="flex flex-col text-left">
            <Link 
              href="/" 
              className="font-mono text-sm text-[#555] hover:text-[#888] font-semibold mb-4 transition-colors select-none"
            >
              hostfa.st
            </Link>
            <p className="text-xs text-[#555] leading-relaxed">
              Your Framer site on your domain for $3/month
            </p>
          </div>

          {/* Column 2 - Product */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-3 select-none">
              Product
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#555] font-medium">
              <Link href="/" className="hover:text-[#888] transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="hover:text-[#888] transition-colors">
                Pricing
              </Link>
              <Link href="/#how-it-works" className="hover:text-[#888] transition-colors">
                How it Works
              </Link>
              <Link href="/register" className="hover:text-[#888] transition-colors">
                Register
              </Link>
            </div>
          </div>

          {/* Column 3 - Compare */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-3 select-none">
              Compare
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#555] font-medium">
              <Link href="/vs/framer" className="hover:text-[#888] transition-colors">
                vs Framer
              </Link>
              <Link href="/vs/webflow" className="hover:text-[#888] transition-colors">
                vs Webflow
              </Link>
              <Link href="/vs/rehost" className="hover:text-[#888] transition-colors">
                vs rehost.it
              </Link>
              <Link href="/framer-hosting-alternative" className="hover:text-[#888] transition-colors">
                Framer Hosting Alternative
              </Link>
            </div>
          </div>

          {/* Column 4 - Tools & Blog */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-3 select-none">
              Free Tools
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#555] font-medium mb-4">
              <Link href="/tools/framer-export" className="hover:text-[#888] transition-colors">
                Framer Exporter
              </Link>
              <Link href="/tools/cost-calculator" className="hover:text-[#888] transition-colors">
                Cost Calculator
              </Link>
              <Link href="/tools/speed-test" className="hover:text-[#888] transition-colors">
                Speed Test
              </Link>
            </div>
            
            <h4 className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-3 select-none mt-4">
              Blog
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#555] font-medium">
              <Link href="/blog/host-framer-site-cheap" className="hover:text-[#888] transition-colors">
                How to Host for Under $5
              </Link>
              <Link href="/blog/framer-vs-webflow-hosting-cost" className="hover:text-[#888] transition-colors">
                Framer vs Webflow Cost
              </Link>
              <Link href="/blog/framer-free-plan-guide" className="hover:text-[#888] transition-colors">
                Framer Free Plan Guide
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#222] mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#555] select-none font-medium">
          <div>
            © 2026 hostfa.st
          </div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#888] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#888] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#888] transition-colors">Twitter/X</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
