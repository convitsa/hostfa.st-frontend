import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 active:scale-[0.98] outline-none select-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-[#EDEDED] text-[#0A0A0A] hover:bg-white",
    secondary: "bg-transparent border border-[#333] text-[#EDEDED] hover:bg-[#1A1A1A]",
    ghost: "bg-transparent text-[#888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]",
    danger: "bg-transparent border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#1F0D0D]",
  };

  const sizes = {
    sm: "h-7 px-3 text-xs",
    md: "h-8 px-4 text-sm",
    lg: "h-9 px-5 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
