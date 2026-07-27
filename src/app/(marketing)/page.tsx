import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ClientsMarquee } from "@/components/sections/marquee";
import { StatsSection } from "@/components/sections/stats";
import { BentoServices } from "@/components/sections/bento-services";
import { ScrollShowcase } from "@/components/sections/scroll-showcase";
import { ProductsHome } from "@/components/sections/products-home";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { TechStackSection } from "@/components/sections/tech-stack";
import { WhyUsSection } from "@/components/sections/why-us";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  siteNavigationSchema,
  faqSchema,
  webPageSchema,
} from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { sitelinkNav } from "@/data/nav";
import { faqs } from "@/data/site-content";
import {
  getFeaturedBlogs,
  getPortfolio,
  getTestimonials,
  getProducts,
  getClientLogos,
} from "@/lib/content";

/**
 * The homepage was the only route on the site without a canonical, so Google had
 * to guess which of `/`, `https://www.…`, and the sitemap's untrailed
 * `https://setups.works` was the real brand entry point. Pinning it here
 * consolidates every brand-query signal onto one URL.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // Brand name first and unqualified — for the query "setups works" the exact
  // string needs to lead the title, not sit behind a tagline.
  title: {
    absolute: `${siteConfig.name} — Digital Agency for Web, App & AI Development`,
  },
  description: siteConfig.description,
  openGraph: {
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const [blogs, portfolio, testimonials, products, logos] = await Promise.all([
    getFeaturedBlogs(3),
    getPortfolio(),
    getTestimonials(true),
    getProducts(),
    getClientLogos(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          webPageSchema({
            path: "/",
            name: `${siteConfig.name} — ${siteConfig.tagline}`,
            description: siteConfig.description,
            isHomePage: true,
          }),
          faqSchema(faqs),
          siteNavigationSchema(
            sitelinkNav.map((l) => ({
              name: l.label,
              url: l.href,
              description: l.description,
            })),
          ),
        ]}
      />
      <Hero />
      <ClientsMarquee logos={logos} />
      <StatsSection />
      <BentoServices />
      <ScrollShowcase />
      <ProductsHome products={products} />
      <PortfolioPreview projects={portfolio} />
      <TechStackSection />
      <WhyUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <BlogPreview blogs={blogs} />
      <FAQSection />
      <CTASection />
    </>
  );
}
