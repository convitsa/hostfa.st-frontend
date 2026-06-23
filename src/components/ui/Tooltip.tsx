"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {React.cloneElement(children as React.ReactElement<any>, {
        title: (children as React.ReactElement<any>).props.title || content,
      })}
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] border border-[#222] text-xs text-[#EDEDED] rounded shadow-lg whitespace-nowrap pointer-events-none select-none">
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
