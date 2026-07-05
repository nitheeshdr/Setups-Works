"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-grid size-9 place-items-center rounded-lg border border-border/60 bg-surface-2/60 text-muted-foreground transition-colors hover:text-foreground hover:border-brand-500/40",
        className,
      )}
    >
      {mounted && (
        <FontAwesomeIcon
          icon={isDark ? faSun : faMoon}
          className="size-4 transition-transform duration-300"
        />
      )}
    </button>
  );
}
