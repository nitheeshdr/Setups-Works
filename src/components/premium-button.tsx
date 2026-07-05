"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "glass" | "outline";
type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

/**
 * Premium CTA button — solid gradient with an animated sheen, or a
 * glass/outline variant. No magnetic/bubble motion.
 */
export function PremiumButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "lg",
  icon,
  className,
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  icon?: IconDefinition;
  className?: string;
  disabled?: boolean;
}) {
  const base = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold tracking-tight transition-all duration-300 disabled:opacity-60",
    sizes[size],
    variant === "primary" &&
      "bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:-translate-y-0.5",
    variant === "glass" &&
      "glass text-foreground hover:border-brand-500/40 hover:-translate-y-0.5",
    variant === "outline" &&
      "border border-border/60 bg-surface-2/40 text-foreground backdrop-blur-sm hover:border-brand-500/40",
    className,
  );

  const inner = (
    <>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="relative size-3.5 transition-transform group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {inner}
    </button>
  );
}
