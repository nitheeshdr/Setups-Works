import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faClock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { faXTwitter, faGithub, faLinkedinIn, faDribbble } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ContactForm } from "@/components/contact-form";
import { FAQSection } from "@/components/sections/faq";
import {
  JsonLd,
  contactPageSchema,
  organizationSchema,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Tell us about your project. Setups Works replies within one business day. Start a conversation about your website, app, or AI product today.",
};

const details = [
  { icon: faEnvelope, label: "Email us", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: faPhone, label: "Call us", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  { icon: faLocationDot, label: "Location", value: siteConfig.location },
  { icon: faClock, label: "Response time", value: "Within 1 business day" },
];

const socials = [
  { icon: faXTwitter, href: siteConfig.links.twitter },
  { icon: faGithub, href: siteConfig.links.github },
  { icon: faLinkedinIn, href: siteConfig.links.linkedin },
  { icon: faDribbble, href: siteConfig.links.dribbble },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          organizationSchema(),
          breadcrumbSchema([{ name: "Contact", url: "/contact" }]),
        ]}
      />
      <PageHeader
        eyebrow="Get in touch"
        title="Let's talk about your project"
        description="Have a project in mind, or just want to explore what's possible? Fill out the form and we'll get back to you within one business day."
        crumbs={[{ label: "Contact" }]}
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            {/* Left — info */}
            <div className="space-y-6">
              <Reveal>
                <div className="glow-border rounded-3xl">
                  <div className="rounded-3xl bg-card p-6">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25">
                      <FontAwesomeIcon icon={faComments} className="size-5" />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-bold tracking-tight">
                      Let&apos;s build something remarkable
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Whether it&apos;s a fully-specced brief or just a spark of an
                      idea, we&apos;d love to hear it.
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-3 sm:grid-cols-2">
                {details.map((d, i) => (
                  <Reveal key={d.label} delay={(i % 2) * 0.06}>
                    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-brand-500/40">
                      <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                        <FontAwesomeIcon icon={d.icon} className="size-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {d.label}
                        </p>
                        {d.href ? (
                          <a href={d.href} className="text-sm font-medium transition-colors hover:text-brand-500">
                            {d.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium">{d.value}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/50 p-5">
                  <p className="text-sm font-semibold">Follow along</p>
                  <div className="flex gap-2">
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-10 place-items-center rounded-lg border border-border/60 bg-surface-2/60 text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-brand-500"
                      >
                        <FontAwesomeIcon icon={s.icon} className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — form in glass panel */}
            <Reveal delay={0.1}>
              <div className="glow-border rounded-3xl">
                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Map — find us on Google Maps */}
          <Reveal>
            <div className="mt-8 overflow-hidden rounded-3xl border border-border/60 bg-card/50">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={faLocationDot} className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Find us on Google Maps</p>
                    <p className="text-xs text-muted-foreground">{siteConfig.location}</p>
                  </div>
                </div>
                <a
                  href={siteConfig.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/60 bg-surface-2/60 px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-brand-500"
                >
                  Open in Maps
                </a>
              </div>
              <iframe
                src={siteConfig.mapEmbed}
                title="Setups Works on Google Maps"
                className="h-[320px] w-full sm:h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <FAQSection />
    </>
  );
}
