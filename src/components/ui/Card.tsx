import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = true, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-[#111] border border-[#222] rounded-lg p-5 ${
        hoverable ? "hover:border-[#333] transition duration-150" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
