import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
import { faXTwitter, faGithub, faLinkedinIn, faDribbble } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ContactForm } from "@/components/contact-form";
import { FAQSection } from "@/components/sections/faq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project. SETUPS WORKS replies within one business day. Start a conversation about your website, app, or AI product today.",
};

const details = [
  { icon: faEnvelope, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: faPhone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
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
      <PageHeader
        eyebrow="Get in touch"
        title="Let's talk about your project"
        description="Have a project in mind, or just want to explore what's possible? Fill out the form and we'll get back to you within one business day."
        crumbs={[{ label: "Contact" }]}
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <div className="space-y-6">
                <div className="grid gap-4">
                  {details.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                        <FontAwesomeIcon icon={d.icon} className="size-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {d.label}
                        </p>
                        {d.href ? (
                          <a href={d.href} className="font-medium transition-colors hover:text-brand-500">
                            {d.value}
                          </a>
                        ) : (
                          <p className="font-medium">{d.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                  <p className="text-sm font-semibold">Follow along</p>
                  <div className="mt-3 flex gap-2">
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
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <FAQSection />
    </>
  );
}
