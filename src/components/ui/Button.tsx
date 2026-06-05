import type {
  ButtonHTMLAttributes,
  ReactNode
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-full px-6 py-3 font-semibold
        transition-all duration-300
        ${
          variant === "primary"
            ? "bg-gradient-to-r from-purple-800 to-purple-600 hover:shadow-lg text-white"
            : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-900"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
