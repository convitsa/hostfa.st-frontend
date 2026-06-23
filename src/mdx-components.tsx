import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="text-lg font-medium text-[#EDEDED] mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-medium text-[#EDEDED] mt-6 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-sm text-[#888] leading-relaxed mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-[#EDEDED] underline underline-offset-2 hover:text-white transition-colors">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="font-mono text-xs bg-[#1A1A1A] px-1.5 py-0.5 rounded text-[#EDEDED]">
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#333] pl-4 text-[#555] italic my-4">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="text-sm text-[#888] space-y-2 pl-4 list-disc my-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="text-sm text-[#888] space-y-2 pl-4 list-decimal my-4">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="list-disc [ol_&]:list-decimal">{children}</li>
    ),
    ...components,
  };
}
