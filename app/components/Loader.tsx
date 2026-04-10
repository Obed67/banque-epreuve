import { Loader2 } from "lucide-react";

type LoaderProps = {
  message?: string;
  color?: "blue" | "green";
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const colorMap = {
  blue: "text-[#0077d2]",
  green: "text-[#1cb427]",
};

export default function Loader({
  message = "Chargement...",
  color = "blue",
  className = "",
  size = "lg",
}: LoaderProps) {
  return (
    <div className={`py-12 text-center ${className}`}>
      <Loader2
        className={`mx-auto mb-3 animate-spin ${sizeMap[size]} ${colorMap[color]}`}
      />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
