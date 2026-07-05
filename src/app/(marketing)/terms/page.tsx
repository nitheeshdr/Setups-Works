import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions governing your use of the Setups Works website and services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: January 2026"
        crumbs={[{ label: "Terms" }]}
      />
      <Section className="pt-4">
        <Container className="max-w-3xl">
          <div className="article-content">
            <p className="lead">
              By using the Setups Works website and services, you agree to these
              terms. Please read them carefully.
            </p>
            <h2>Use of our services</h2>
            <p>
              You may use our website and services for lawful purposes only. You
              agree not to misuse, disrupt, or attempt to gain unauthorized
              access to any part of our systems.
            </p>
            <h2>Intellectual property</h2>
            <p>
              All content on this website — including text, graphics, logos, and
              code — is the property of Setups Works unless otherwise stated.
              For client projects, IP ownership transfers to the client upon
              final payment as specified in your project agreement.
            </p>
            <h2>Project engagements</h2>
            <p>
              Specific terms for client work — including scope, timelines,
              payment, and deliverables — are governed by individual project
              agreements signed before work begins.
            </p>
            <h2>Limitation of liability</h2>
            <p>
              Our website and services are provided &ldquo;as is.&rdquo; To the
              fullest extent permitted by law, Setups Works is not liable for
              any indirect or consequential damages arising from your use of the
              site.
            </p>
            <h2>Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              site after changes constitutes acceptance of the new terms.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
