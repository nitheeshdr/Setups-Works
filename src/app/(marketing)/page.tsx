import { Hero } from "@/components/sections/hero";
import { ClientsMarquee } from "@/components/sections/marquee";
import { StatsSection } from "@/components/sections/stats";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProcessSection } from "@/components/sections/process";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { TechStackSection } from "@/components/sections/tech-stack";
import { WhyUsSection } from "@/components/sections/why-us";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/json-ld";
import {
  getFeaturedBlogs,
  getPortfolio,
  getTestimonials,
  getProducts,
} from "@/lib/content";

export const revalidate = 300;

export default async function HomePage() {
  const [blogs, portfolio, testimonials, products] = await Promise.all([
    getFeaturedBlogs(3),
    getPortfolio(),
    getTestimonials(true),
    getProducts(),
  ]);
  const codeforge = products[0];

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <ClientsMarquee />
      <StatsSection />
      <ServicesPreview />
      <ProcessSection />
      {codeforge && <FeaturedProduct product={codeforge} />}
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
