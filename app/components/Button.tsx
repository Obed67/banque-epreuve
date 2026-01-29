import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-[#0077d2] hover:bg-[#0066b8] text-white focus:ring-[#0077d2]",
    success: "bg-[#1cb427] hover:bg-[#18991f] text-white focus:ring-[#1cb427]",
    warning: "bg-[#ffa446] hover:bg-[#ff9329] text-white focus:ring-[#ffa446]",
    outline:
      "bg-white border-2 border-white text-[#0077d2] hover:bg-white/90 focus:ring-white font-semibold shadow-sm",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
