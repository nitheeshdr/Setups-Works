import { siteConfig } from "@/lib/site";
import type { Blog, Product, Portfolio, Founder, Service } from "@/lib/types";
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

/**
 * Brand/company social profiles ONLY — the accounts that belong to Setups Works
 * itself. The founder's personal profiles (his GitHub, LinkedIn, IMDb, YouTube)
 * must NOT appear here, or search engines conflate the org with the person.
 */
const orgSameAs: string[] = [
  siteConfig.links.twitter, // x.com/setupsworks
  siteConfig.links.linkedin, // linkedin.com/company/setups-works
  siteConfig.links.instagram, // instagram.com/setups.works
  siteConfig.googleBusiness, // GBP share link
  siteConfig.googleMaps, // canonical Maps listing (CID) — local entity anchor
  siteConfig.wikidata, // wikidata.org/wiki/Q140500419 — entity anchor
].filter(Boolean);
const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** Self-contained Organization reference used by the founder Person node. */
const orgReference = {
  "@id": ORG_ID,
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
};

/* --------------------------- Organization ------------------------------ */
/**
 * Single business entity typed as BOTH Organization and ProfessionalService.
 * One @id, one node — so Google shows one "Setups Works" instead of two,
 * while still carrying the local-business signals (geo, hours, price range)
 * that power Maps / the local pack alongside the brand/Knowledge-Panel data.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    // LocalBusiness is stated explicitly even though ProfessionalService is
    // already one of its subtypes. The hierarchy is Organization >
    // LocalBusiness > ProfessionalService, so this adds no contradiction — it
    // just spares any consumer that doesn't resolve schema.org subtypes from
    // having to infer it.
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: siteConfig.name,
    // "Setups Works" is two ordinary English words, so brand queries compete
    // with generic results. Listing the spellings people actually type helps
    // Google bind the query to this entity rather than to the dictionary sense.
    alternateName: [
      "SetupsWorks",
      "Setups.Works",
      "setups.works",
      "SETUPS WORKS",
      "Setups Works Digital Agency",
    ],
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
    legalName: siteConfig.name,
    foundingDate: siteConfig.foundingDate,
    foundingLocation: {
      "@type": "Place",
      name: `${siteConfig.address.locality}, ${siteConfig.address.region}, India`,
    },
    slogan: siteConfig.tagline,
    priceRange: siteConfig.priceRange,
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "AI Development",
      "Automation",
      "CRM Development",
      "UI/UX Design",
      "SEO",
      "Digital Marketing",
      "SaaS Products",
    ],
    keywords: siteConfig.keywords.join(", "),
    address: {
      "@type": "PostalAddress",
      // Only emitted when set — an empty streetAddress is worse than none,
      // and it must match the Google Business Profile listing.
      ...(siteConfig.address.street
        ? { streetAddress: siteConfig.address.street }
        : {}),
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    // Currency and payment terms are business facts, not guesses — add them to
    // siteConfig when known. Deliberately absent rather than invented.
    //
    // NOTE: no aggregateRating here on purpose. Google does not allow
    // self-serving reviews for LocalBusiness/Organization — ratings a business
    // collects and publishes about itself are ineligible for review rich
    // results and risk a manual action. The 4.9/5 shown on the site is fine as
    // page content; it must not be marked up as aggregateRating on this entity.
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    hasMap: siteConfig.googleMaps,
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
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
    sameAs: orgSameAs,
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
    // Explicit (not just @id) so Google reads "founder of Setups Works"
    // unambiguously — this is what surfaces the company in his Knowledge Panel.
    worksFor: orgReference,
    founderOf: orgReference,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: p.alumniOf,
    },
    nationality: { "@type": "Country", name: "IN" },
    hasOccupation: {
      "@type": "Occupation",
      name: "Chief Executive Officer",
      occupationLocation: { "@type": "City", name: "Chennai" },
      skills: p.knowsAbout.join(", "),
    },
    knowsAbout: p.knowsAbout,
    // Personal profiles only. Filter out the company's brand accounts so the
    // org's X/LinkedIn/etc. can never leak into the founder's identity, which
    // would confuse Knowledge Panel entity reconciliation.
    sameAs: Array.from(
      new Set(
        [
          ...p.sameAs,
          founder?.linkedin,
          founder?.twitter,
        ].filter(
          (url): url is string => !!url && !orgSameAs.includes(url),
        ),
      ),
    ),
  };
}

/* ------------------------------ ProfilePage ---------------------------- */
/**
 * Marks /about as a profile page whose subject is the founder, so Google reads
 * it as "Profile page for Nitheesh Rajendran" rather than an Organization page.
 * mainEntity points at the Person node (#founder) rendered alongside it.
 */
export function profilePageSchema(founder?: Founder) {
  const p = siteConfig.founderProfile;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/about/#profilepage`,
    url: `${siteConfig.url}/about`,
    name: `${founder?.name || p.name} — ${founder?.role || p.jobTitle}`,
    // Google's ProfilePage requires full ISO 8601 datetime (with time + offset),
    // not a bare date. +05:30 = IST (Chennai).
    dateCreated: `${siteConfig.foundingDate}-01-01T00:00:00+05:30`,
    dateModified: `${siteConfig.foundingDate}-01-01T00:00:00+05:30`,
    mainEntity: { "@id": `${siteConfig.url}/#founder` },
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${siteConfig.url}/about#breadcrumb` },
  };
}

/* ------------------------------ ContactPage ---------------------------- */
/**
 * Marks /contact as the business's contact page and binds it to the same
 * Organization entity, reinforcing NAP + map signals for local SEO.
 */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteConfig.url}/contact/#contactpage`,
    url: `${siteConfig.url}/contact`,
    name: `Contact ${siteConfig.name}`,
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${siteConfig.url}/contact#breadcrumb` },
  };
}

/* -------------------------------- FAQPage ------------------------------ */
/** FAQ rich results for pages that render the FAQ section. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
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
/**
 * Declares the site's primary destinations as an ordered ItemList of
 * SiteNavigationElements — the machine-readable half of the sitelinks signal.
 *
 * Sitelinks are ultimately algorithmic: Google picks them from site structure,
 * internal anchor text, and breadcrumbs, and this markup only describes what it
 * already crawls. It is `itemListOrder`-ed so our preferred ranking is explicit
 * rather than inferred, and each entry carries its own description so the
 * candidates read as distinct pages.
 */
export function siteNavigationSchema(
  items: { name: string; url: string; description?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/#sitenav`,
    name: `${siteConfig.name} primary navigation`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
      isPartOf: { "@id": WEBSITE_ID },
    })),
  };
}

/* -------------------------------- WebPage ------------------------------ */
/**
 * Binds a page to the site and the Organization that publishes it. Giving every
 * top-level destination a stable @id and an explicit `isPartOf` edge is what
 * lets crawlers see the site as one entity with a hierarchy — a precondition
 * for sitelinks — instead of a bag of unrelated URLs.
 */
export function webPageSchema({
  path,
  name,
  description,
  isHomePage = false,
}: {
  path: string;
  name: string;
  description: string;
  isHomePage?: boolean;
}) {
  // `path === "/"` collapses to the bare origin so the node's url/@id line up
  // with the trailing-slash-free canonical Next emits for the homepage.
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": isHomePage ? ["WebPage", "CollectionPage"] : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    ...(isHomePage
      ? { primaryImageOfPage: { "@type": "ImageObject", url: `${siteConfig.url}/opengraph-image` } }
      : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
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
export function serviceSchema(service: Service) {
  const offers = service.features?.length
    ? {
        "@type": "OfferCatalog",
        name: `${service.title} — what's included`,
        itemListElement: service.features.map((f) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: f },
        })),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/services/${service.slug}#service`,
    name: service.title,
    description: service.seoDescription || service.description,
    serviceType: service.category,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
    ...(service.heroImage ? { image: service.heroImage } : {}),
    ...(offers ? { hasOfferCatalog: offers } : {}),
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

/**
 * The standard schema pair for a top-level destination: a WebPage node bound to
 * the site graph, plus the BreadcrumbList it references. Every page in
 * `sitelinkNav` emits this so the whole sitelink candidate set is described
 * consistently — a page Google can't place in the hierarchy rarely gets picked.
 */
export function pageSchemas({
  path,
  label,
  description,
}: {
  path: string;
  label: string;
  description: string;
}) {
  return [
    // The Organization and WebSite nodes ship on every page rather than only on
    // the homepage: WebPage.isPartOf/about/publisher reference them by @id, and
    // a reference whose target isn't defined in the same document is a dangling
    // edge. Crawlers do consolidate nodes across a site, but making each page's
    // graph resolve on its own removes the dependency on that happening.
    organizationSchema(),
    websiteSchema(),
    webPageSchema({ path, name: `${label} · ${siteConfig.name}`, description }),
    breadcrumbSchema([{ name: label, url: path }]),
  ];
}

/* ------------------------------- Breadcrumb ---------------------------- */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  // The trail always ends on the current page, so its URL is the stable anchor
  // that webPageSchema()'s `breadcrumb` reference points back at.
  const pageUrl = `${siteConfig.url}${items[items.length - 1]?.url ?? "/"}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
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
