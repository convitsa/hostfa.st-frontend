import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs uppercase tracking-wider text-[#888] font-medium">
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            type={inputType}
            className={`w-full bg-[#111] border text-[#EDEDED] placeholder-[#555] focus:border-[#444] focus:outline-none focus:ring-0 h-8 pl-3 pr-${
              isPassword ? "9" : "3"
            } text-sm rounded-md transition-all ${
              error ? "border-[#EF4444]/50" : "border-[#222]"
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 text-[#555] hover:text-[#EDEDED] transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

