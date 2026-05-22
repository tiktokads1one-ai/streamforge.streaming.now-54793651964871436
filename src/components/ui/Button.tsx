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
            ? "bg-indigo-500 hover:bg-indigo-600 text-white"
            : "bg-white/10 border border-white/10 hover:bg-white/20 text-white"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
