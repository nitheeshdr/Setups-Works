import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FooterWordmark } from "@/components/layout/footer-wordmark";
import { footerNav } from "@/data/nav";
import { siteConfig } from "@/lib/site";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedinIn,
  faDribbble,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const socials = [
  { icon: faXTwitter, href: siteConfig.links.twitter, label: "X / Twitter" },
  { icon: faLinkedinIn, href: siteConfig.links.linkedin, label: "LinkedIn" },
  { icon: faDribbble, href: siteConfig.links.dribbble, label: "Dribbble" },
  { icon: faInstagram, href: siteConfig.links.instagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border/60 bg-surface-2/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]"
      />
      <Container className="relative py-16">
        {/* CTA row */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border/60 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/10 p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Let&apos;s build something remarkable.
            </h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Tell us about your project and we&apos;ll get back within one business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600"
          >
            Start a project
            <FontAwesomeIcon
              icon={faArrowRight}
              className="size-3.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Join our newsletter</p>
              <NewsletterForm />
            </div>
            <div className="flex gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg border border-border/60 bg-surface-2/60 text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-brand-500"
                >
                  <FontAwesomeIcon icon={s.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-sm font-semibold">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-brand-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <FooterWordmark />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Crafted with precision · {siteConfig.location}
          </p>
        </div>
      </Container>
    </footer>
  );
}
