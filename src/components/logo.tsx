import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Full Setups Works wordmark — swaps between light/dark variants via CSS. */
export function Logo({
  className,
  priority,
  href = "/",
}: {
  className?: string;
  priority?: boolean;
  href?: string | null;
}) {
  const content = (
    <>
      <Image
        src="/black.png"
        alt="Setups Works — The Digital Agency"
        width={200}
        height={72}
        priority={priority}
        className="h-9 w-auto object-contain dark:hidden"
      />
      <Image
        src="/white.png"
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

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icon-512.png"
      alt="Setups Works Logo"
      width={36}
      height={36}
      className={cn("object-contain", className)}
    />
  );
}
