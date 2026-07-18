import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Full Setups Works wordmark — swaps between light/dark variants via CSS. */
export function Logo({
  className,
  priority,
  href = "/",
  logoLight,
  logoDark,
}: {
  className?: string;
  priority?: boolean;
  href?: string | null;
  logoLight?: string | null;
  logoDark?: string | null;
}) {
  const content = (
    <>
      <Image
        src={logoLight || "/black.png"}
        alt="Setups Works — The Digital Agency"
        width={200}
        height={72}
        priority={priority}
        className="h-9 w-auto object-contain dark:hidden"
      />
      <Image
        src={logoDark || "/white.png"}
        alt="Setups Works — The Digital Agency"
        width={200}
        height={72}
        priority={priority}
        className="hidden h-9 w-auto object-contain dark:block"
      />
    </>
  );

  if (href === null) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Setups Works home"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-80",
        className,
      )}
    >
      {content}
    </Link>
  );
}

/** Compact square monogram (favicon mark) for tight spaces. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-display font-bold text-white shadow-lg shadow-brand-500/30",
        className,
      )}
    >
      SW
    </span>
  );
}
