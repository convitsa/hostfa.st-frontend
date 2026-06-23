import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 gap-3 animate-fade-mount select-none">
      <svg className="animate-spin h-6 w-6 text-[#888]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="text-sm text-[#888]">Loading onboarding wizard...</span>
    </div>
  );
}
