import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-transparent text-text-primary border border-border hover:border-accent",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary",
};

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      data-cursor="hover"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-body font-semibold text-sm transition-colors duration-300 ease-premium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
