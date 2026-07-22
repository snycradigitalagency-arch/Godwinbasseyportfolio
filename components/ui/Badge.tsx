import clsx from "clsx";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "success" | "accent";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "border-border text-text-secondary",
  success: "border-success/30 text-success",
  accent: "border-accent/30 text-accent",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-body font-medium",
        toneStyles[tone],
        className
      )}
    >
      {tone === "success" && (
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
      )}
      {children}
    </span>
  );
}
