"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({ message = "An unexpected error occurred.", onRetry }: ErrorCardProps) {
  return (
    <div className="bg-[#111] border border-[#EF4444]/20 rounded-lg p-6 flex flex-col items-center text-center max-w-md mx-auto w-full my-6 select-none animate-fade-mount">
      <div className="text-[#EF4444] mb-3">
        <XCircle size={32} />
      </div>
      <h2 className="text-sm font-medium text-[#EDEDED] mb-1">
        Something went wrong
      </h2>
      <p className="text-sm text-[#888] mb-4 max-w-xs break-words">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="text-xs">
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorCard;
