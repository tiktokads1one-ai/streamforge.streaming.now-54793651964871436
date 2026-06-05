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
            ? "bg-gradient-to-r from-purple-deep to-purple hover:shadow-glow-sm text-white"
            : "bg-surface-card border border-purple-500/20 hover:bg-surface-hover text-white"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
