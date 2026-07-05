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
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/json-ld";
import {
  getFeaturedBlogs,
  getPortfolio,
  getTestimonials,
  getProducts,
  getClientLogos,
} from "@/lib/content";

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
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
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
