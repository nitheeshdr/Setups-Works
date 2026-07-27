import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faShieldHalved,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { LeadForm } from "@/components/lead-form";
import { JsonLd, pageSchemas } from "@/components/seo/json-ld";
import { getServices } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const description =
  "Request a quotation or send an enquiry to Setups Works. Tell us about your web, mobile, or AI project and we'll reply within one business day.";

export const metadata: Metadata = {
  alternates: { canonical: "/get-started" },
  title: "Get a Quote",
  description,
  openGraph: { title: `Get a Quote · ${siteConfig.name}`, description, url: "/get-started" },
};

export const revalidate = 300;

const assurances = [
  { icon: faClock, title: "Reply within a day", body: "A real person reads every submission and responds within one business day." },
  { icon: faShieldHalved, title: "Your details stay private", body: "We never share or sell your information, and we don't add you to a mailing list." },
  { icon: faCircleCheck, title: "No obligation", body: "A quotation is just a conversation. There's nothing to commit to." },
];

export default async function GetStartedPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={pageSchemas({ path: "/get-started", label: "Get a Quote", description })}
      />
      <PageHeader
        eyebrow="Start a project"
        title="Tell us what you're building"
        description="Request a quotation or ask a question. Either way you'll hear back from us within one business day."
        crumbs={[{ label: "Get a Quote" }]}
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <Reveal>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                <LeadForm
                  services={services.map((s) => s.title)}
                  source="/get-started"
                />
              </div>
            </Reveal>

            <div className="space-y-4">
              {assurances.map((a, i) => (
                <Reveal key={a.title} delay={0.05 * (i + 1)}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                      <FontAwesomeIcon icon={a.icon} className="size-4" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{a.body}</p>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    Prefer to talk?
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-brand-500"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="size-3.5 text-brand-500" />
                      {siteConfig.email}
                    </a>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-brand-500"
                    >
                      <FontAwesomeIcon icon={faPhone} className="size-3.5 text-brand-500" />
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
