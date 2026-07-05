import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-fade-b" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[130px]"
      />

      <Link href="/" className="mb-10">
        <Logo />
      </Link>

      <p className="font-display text-[7rem] font-bold leading-none tracking-tighter text-gradient sm:text-[10rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        This page took a wrong turn
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <FontAwesomeIcon icon={faHouse} className="size-4" />
          Back home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-6 py-3.5 font-semibold transition-colors hover:border-brand-500/40"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="size-4" />
          Search the site
        </Link>
      </div>

      <Link
        href="/contact"
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-3" />
        Or get in touch with us
      </Link>
    </main>
  );
}
