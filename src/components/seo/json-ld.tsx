import { siteConfig } from "@/lib/site";
import type { Blog, Product, Portfolio, Founder } from "@/lib/types";
import { stripHtml, truncate } from "@/lib/helpers";

/** Renders one or more JSON-LD schema objects as script tags. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

const socialLinks = Object.values(siteConfig.links).filter(Boolean);
const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/* ----------------------------- Organization ---------------------------- */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: "SETUPS WORKS",
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: siteConfig.foundingDate,
    slogan: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: "customer service",
        areaServed: siteConfig.areaServed,
        availableLanguage: ["English"],
      },
    ],
    founder: { "@id": `${siteConfig.url}/#founder` },
    sameAs: [...socialLinks, siteConfig.googleBusiness],
  };
}

/* ----------------------------- LocalBusiness --------------------------- */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/icon-512.png`,
    logo: `${siteConfig.url}/icon-512.png`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    hasMap: siteConfig.googleBusiness,
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [...socialLinks, siteConfig.googleBusiness],
  };
}

/* ------------------------- Person (the founder) ------------------------ */
export function personSchema(founder?: Founder) {
  const p = siteConfig.founderProfile;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#founder`,
    name: founder?.name || p.name,
    jobTitle: founder?.role || p.jobTitle,
    description: founder?.bio || p.description,
    url: `${siteConfig.url}/about`,
    ...(founder?.photo ? { image: founder.photo } : {}),
    worksFor: { "@id": ORG_ID },
    founderOf: { "@id": ORG_ID },
    knowsAbout: p.knowsAbout,
    sameAs: Array.from(
      new Set(
        [
          ...p.sameAs,
          founder?.linkedin,
          founder?.twitter,
        ].filter(Boolean) as string[],
      ),
    ),
  };
}

/* -------------------------------- WebSite ------------------------------ */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    // Enables Google's sitelinks search box.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* --------------------- SiteNavigation (helps sitelinks) ---------------- */
export function siteNavigationSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Primary navigation",
    itemListElement: items.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
    })),
  };
}

/* -------------------------------- Article ------------------------------ */
export function articleSchema(blog: Blog) {
  const plain = stripHtml(blog.content);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}/blog/${blog.slug}/#article`,
    headline: blog.title,
    description: blog.seoDescription || blog.excerpt,
    articleBody: plain,
    wordCount: plain.split(/\s+/).filter(Boolean).length,
    image: [blog.ogImage || blog.featuredImage],
    keywords: blog.tags.join(", "),
    articleSection: blog.category,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: blog.author,
      ...(blog.authorRole ? { jobTitle: blog.authorRole } : {}),
    },
    publisher: { "@id": ORG_ID },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt ?? blog.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${blog.slug}`,
    },
    timeRequired: `PT${blog.readingTime}M`,
  };
}

/* -------------------------------- Product ------------------------------ */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: truncate(stripHtml(product.description), 300),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    image: product.banner || product.logo,
    url: `${siteConfig.url}/products/${product.slug}`,
    ...(product.version ? { softwareVersion: product.version } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
    },
  };
}

/* --------------------------------- Service ----------------------------- */
export function serviceSchema(service: {
  title: string;
  description: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.category,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

/* ------------------------------- CreativeWork -------------------------- */
export function portfolioSchema(project: Portfolio) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.coverImage,
    url: `${siteConfig.url}/portfolio/${project.slug}`,
    creator: { "@id": ORG_ID },
    genre: project.category,
    ...(project.year ? { dateCreated: project.year } : {}),
    keywords: project.techStack.join(", "),
  };
}

/* ------------------------------- Breadcrumb ---------------------------- */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${siteConfig.url}${item.url}`,
      })),
    ],
  };
}
