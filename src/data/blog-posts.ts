import type { Blog } from "@/lib/types";

/**
 * Built-in article catalogue.
 *
 * Blogs are database-backed and edited from /admin/blogs. This array is the
 * fallback used when the collection is empty — same contract as
 * `src/data/services.ts`, so a fresh install renders a real blog rather than an
 * empty index.
 *
 * These exist because an empty blog is an entity-confidence problem, not just a
 * marketing gap: a site claiming years of delivery with nothing published reads
 * to a crawler as inactive. Every article below is written from what this
 * agency actually does — no invented clients, metrics, or case studies.
 *
 * Images are Unsplash URLs, already allowed in next.config remotePatterns.
 */

const AUTHOR = {
  author: "Nitheesh Rajendran",
  authorRole: "Founder & CEO",
} as const;

export const blogPosts: Blog[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "how-much-does-a-website-cost-in-india",
    title: "How Much Does a Website Cost in India? An Honest Breakdown",
    excerpt:
      "What actually drives website pricing — and why the same brief gets quoted at ₹15,000 and ₹8,00,000 by two agencies who are both being truthful.",
    category: "Business",
    tags: ["Website Cost", "Pricing", "Web Development", "India", "Hiring an Agency"],
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    readingTime: 9,
    status: "published",
    featured: true,
    publishedAt: "2026-02-12T09:00:00.000Z",
    seoTitle: "How Much Does a Website Cost in India? (2026)",
    seoDescription:
      "A breakdown of what website pricing in India actually covers — scope, design depth, integrations, and the ongoing costs most quotes leave out.",
    ...AUTHOR,
    content: `
<p>Ask five agencies to quote the same website and you will get five numbers that look unrelated. That is not dishonesty. It is that "a website" describes a brochure with five pages and a booking platform handling payments equally well, and nobody agrees which one you meant.</p>

<p>Here is what actually moves the number.</p>

<h2>The four things that set the price</h2>

<h3>1. How much of it is bespoke</h3>
<p>A template configured with your content is a different job from a design built for your business. Templates are cheap because the expensive decisions — layout, hierarchy, interaction — were made once and sold many times. That is a legitimate choice when your site's job is to look credible and list what you do.</p>
<p>It stops being a good choice when the site has to do something specific. The moment your flow does not match the template's assumptions, you spend more fighting it than you would have spent building it.</p>

<h3>2. Whether it has to talk to anything</h3>
<p>A site that stands alone is bounded work. A site that syncs to a CRM, takes payments, checks stock, or issues invoices is a different discipline. Each integration brings someone else's API, someone else's downtime, and error cases you have to handle rather than hope about.</p>
<p>This is usually the single biggest gap between two quotes for what sounded like the same brief.</p>

<h3>3. Who edits it afterwards</h3>
<p>"We can update it for you" and "your team updates it without calling us" are different builds. The second needs a content model, an admin, permissions, and preview — real engineering that pays back permanently if you publish often, and is wasted if you do not.</p>
<p>Be honest about your publishing cadence before paying for a CMS. Many businesses buy one and change the site twice a year.</p>

<h3>4. What happens on launch day</h3>
<p>Cheap quotes usually end at launch. Then something breaks, a dependency needs patching, a certificate expires, and there is no one whose job it is. Ask explicitly what happens in month two — the answer tells you what you are actually buying.</p>

<h2>The costs quotes leave out</h2>
<ul>
  <li><strong>Hosting and domain.</strong> Small, recurring, but it never stops.</li>
  <li><strong>Content.</strong> Copy and photography are frequently the reason a "finished" site sits unlaunched for months. Whoever writes it, someone has to.</li>
  <li><strong>Maintenance.</strong> Dependencies age whether or not you touch the code. Security patches are not optional.</li>
  <li><strong>Changes.</strong> Your business will change within a year. A site that cannot follow it is a cost, not an asset.</li>
</ul>

<h2>How to compare two quotes properly</h2>
<p>Do not compare totals. Ask both for the same five answers:</p>
<ol>
  <li>What exactly is in scope, page by page?</li>
  <li>Which integrations are included, and who owns them when they break?</li>
  <li>Can we edit content ourselves, and what can we not edit?</li>
  <li>What happens in month two, and what does that cost?</li>
  <li>Who owns the code and the accounts?</li>
</ol>
<p>That last one matters more than people expect. If the agency owns your hosting, analytics, and domain, the price of leaving is not on the quote.</p>

<h2>What we would tell you before you spend anything</h2>
<p>If your site's job is credibility, buy a small, fast, well-built site and put the money you saved into content. If your site's job is to run part of your business, treat it as software and budget accordingly — including for the year after launch.</p>
<p>The expensive mistake is buying the first kind while needing the second.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "why-your-website-is-slow",
    title: "Why Your Website Is Slow — and What Actually Fixes It",
    excerpt:
      "Most speed advice treats symptoms. Here are the causes that genuinely account for slow sites, in the order worth fixing them.",
    category: "Technology",
    tags: ["Core Web Vitals", "Performance", "SEO", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    readingTime: 8,
    status: "published",
    featured: true,
    publishedAt: "2026-03-04T09:00:00.000Z",
    seoTitle: "Why Your Website Is Slow (And How to Fix It)",
    seoDescription:
      "The real causes of slow websites — images, render-blocking scripts, third-party tags and hosting — ranked by how much each one actually costs you.",
    ...AUTHOR,
    content: `
<p>Almost every slow site we are asked to look at is slow for one of four reasons. None of them are exotic, and the order matters, because fixing the fourth while ignoring the first is how people spend a month and gain nothing.</p>

<h2>1. Images, by a wide margin</h2>
<p>Images are usually most of a page's weight. The common failure is not "we have too many pictures" — it is shipping a 4000px photograph to a phone that will display it at 400px, in a format from 1996.</p>
<p>What actually fixes it: serve modern formats, size images to their display size, and let the browser pick from a set rather than guessing. Lazy-load anything below the fold, but never the main image — that one you want early.</p>
<p>This alone frequently halves load time, and it is the least glamorous work on the list.</p>

<h2>2. JavaScript that blocks the first paint</h2>
<p>A browser cannot show your page while it is parsing a script that might change it. Every render-blocking script is a queue the user waits in.</p>
<p>The fix is not "use less JavaScript" as a slogan. It is deciding what genuinely needs to run before first paint — usually almost nothing — and deferring the rest. Server-rendered HTML that is readable before any script executes is the difference between a page that appears and a page that assembles itself while you watch.</p>

<h2>3. Third-party tags nobody owns</h2>
<p>Analytics, chat widgets, heatmaps, ad pixels, a font from one CDN and an icon set from another. Each was added for a reason, usually by a different person, often years apart. Nobody has removed one since.</p>
<p>Third-party scripts are the worst kind of slow because you do not control them. Their outage is your outage. Audit what is actually loading, and delete anything nobody can name a current use for. This is the highest ratio of improvement to effort on the entire list.</p>

<h2>4. Hosting and delivery</h2>
<p>If your server is in one country and your customers are in another, physics charges you for it. A CDN puts your assets near the person requesting them.</p>
<p>Worth saying plainly: hosting is the last thing to blame, not the first. Moving a badly built site to faster hosting produces a badly built site that is slightly less slow.</p>

<h2>Measure the right things</h2>
<p>Chase field data, not lab scores. A perfect score on your laptop over office broadband says nothing about a customer on a mid-range Android phone. The metrics that matter are the ones about human experience: how long until something appears, how long until it responds, and whether the layout jumps while they are reading.</p>

<h2>Why this is an SEO issue, not just a UX one</h2>
<p>Speed is a ranking input, but the larger effect is behavioural. Slow pages get abandoned, abandonment is measurable, and a page nobody stays on does not hold a position for long. You are not optimising for a score. You are optimising for the person who decides within two seconds whether to wait.</p>

<h2>Where to start on Monday</h2>
<ol>
  <li>Measure real-user data before changing anything, so you can prove the change worked.</li>
  <li>Fix images. Almost always the biggest single win.</li>
  <li>Remove third-party scripts nobody can justify.</li>
  <li>Defer everything that does not need to run before first paint.</li>
  <li>Only then look at hosting.</li>
</ol>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom Software vs Off-the-Shelf: How to Decide",
    excerpt:
      "Building software you could have bought is expensive. Buying software that does not fit is more expensive. A practical way to tell which situation you are in.",
    category: "Business",
    tags: ["Custom Software", "SaaS", "Business", "Software Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1600&q=80",
    readingTime: 8,
    status: "published",
    publishedAt: "2026-04-08T09:00:00.000Z",
    seoTitle: "Custom Software vs Off-the-Shelf: How to Decide",
    seoDescription:
      "When building custom software is worth it, when off-the-shelf wins, and the questions that tell you which situation your business is actually in.",
    ...AUTHOR,
    content: `
<p>Most businesses ask this question too late — after they have spent two years bending a product to fit a process it was never designed for, and the workarounds have become the job.</p>

<p>There is a reasonable way to decide, and it has little to do with cost.</p>

<h2>Off-the-shelf is right more often than founders think</h2>
<p>If a product exists that does what you need, buying it is nearly always correct. You get years of accumulated edge cases, a support team, security patches, and a roadmap — none of which appear on the price tag but all of which you would otherwise fund yourself, permanently.</p>
<p>Building something you could have bought is one of the most expensive mistakes available to a business, and it rarely feels like a mistake while you are doing it.</p>

<h2>Custom earns its cost in three situations</h2>

<h3>1. Your process is the product</h3>
<p>If the way you do the work <em>is</em> your advantage, software that forces you into someone else's workflow removes the thing you compete on. Generic tooling makes you generic.</p>

<h3>2. The integration burden exceeds the tool</h3>
<p>When five systems must talk to each other and none were designed to, the connective work becomes the real project. At that point the "cheap" tools are not cheap — you are paying people to be middleware.</p>

<h3>3. Per-seat pricing has outgrown the value</h3>
<p>SaaS pricing scales with headcount; your need often does not. There is a crossover point where a fixed build costs less than a growing subscription. It arrives later than vendors imply and sooner than most businesses notice.</p>

<h2>Four questions that usually settle it</h2>
<ol>
  <li><strong>How many people work around the current tool daily?</strong> Re-keying data between systems is a cost with a real number attached. Calculate it.</li>
  <li><strong>Would you change how you work to fit a product?</strong> If yes, buy. If the process is genuinely your edge, that answer is no.</li>
  <li><strong>What happens if the vendor changes pricing or shuts down?</strong> If that is existential, you have a dependency problem regardless of which way you go.</li>
  <li><strong>Can you describe the workflow precisely?</strong> If not, you are not ready to build. Custom software makes a well-understood process faster; it does not discover the process for you.</li>
</ol>

<h2>The middle path most people miss</h2>
<p>It is rarely all or nothing. The strongest setups we see buy the commodity parts — accounting, email, payments, storage — and build only the piece that is genuinely theirs, connected to the rest by an API.</p>
<p>You end up owning the thing that makes you different and renting everything that does not. That is usually the correct shape.</p>

<h2>If you do build</h2>
<p>Build the smallest thing that removes the most painful manual step, put it in front of real users, and let what they actually do decide what comes next. The failure mode of custom software is not bad code. It is building twelve months of features nobody needed because nobody was using it yet.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "nextjs-or-wordpress",
    title: "Next.js or WordPress? Choosing Without Regret",
    excerpt:
      "The choice is not about which is better. It is about who edits the site, how often, and what it has to do beyond publishing.",
    category: "Technology",
    tags: ["Next.js", "WordPress", "Headless CMS", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=80",
    readingTime: 7,
    status: "published",
    publishedAt: "2026-05-20T09:00:00.000Z",
    seoTitle: "Next.js or WordPress? How to Choose",
    seoDescription:
      "A practical comparison of Next.js and WordPress based on who edits your site, how often you publish, and what the site has to do beyond content.",
    ...AUTHOR,
    content: `
<p>This gets argued as a technology question. It is really a question about who touches the site after launch.</p>

<h2>WordPress is right when publishing is the point</h2>
<p>If non-technical people publish several times a week, WordPress earns its place. The editing experience is familiar, the plugin ecosystem covers most requests without custom work, and hiring someone to maintain it is easy anywhere in the world.</p>
<p>Its costs are equally real: plugins are third-party code running on your site, each one a maintenance and security surface. Performance is achievable but not free — it is something you actively defend against every plugin added later.</p>

<h2>Next.js is right when the site is closer to an application</h2>
<p>When the site has to do things — authenticated areas, real-time data, complex flows, tight integrations — a framework designed for applications stops fighting you.</p>
<p>You get speed by default rather than by maintenance, a single language across front and back, and rendering choices per page: static where content rarely changes, server-rendered where it must be fresh. The cost is that changing the site usually requires a developer.</p>

<h2>The combination worth knowing about</h2>
<p>Headless WordPress keeps the editor your team already knows and renders the front end with Next.js. Editors get their familiar admin; visitors get a fast site.</p>
<p>Be honest about the trade: it is two systems to maintain instead of one. Worth it when both requirements are genuinely non-negotiable, over-engineering when only one is.</p>

<h2>Questions that decide it</h2>
<ul>
  <li><strong>How often does content change, and by whom?</strong> Daily by non-developers points to WordPress. Occasionally, or by developers, points to Next.js.</li>
  <li><strong>Is this a website or an application?</strong> If users log in and do things, you are building software.</li>
  <li><strong>How much does speed matter commercially?</strong> If you sell through the site, it matters more than it feels like it does.</li>
  <li><strong>Who maintains it in two years?</strong> Choose what your actual team can run, not what is most interesting to build.</li>
</ul>

<h2>The honest summary</h2>
<p>Neither choice is a mistake in the situation it suits. The mistake is choosing on preference rather than on who edits the site and what it has to do — and then spending two years paying for it.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "shopify-or-woocommerce",
    title: "Shopify or WooCommerce? A Straight Comparison",
    excerpt:
      "Both will sell your products. They fail in different ways, and which failure you can live with is the actual decision.",
    category: "Business",
    tags: ["Shopify", "WooCommerce", "E-commerce", "Online Store"],
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    readingTime: 7,
    status: "published",
    publishedAt: "2026-06-10T09:00:00.000Z",
    seoTitle: "Shopify or WooCommerce? A Straight Comparison",
    seoDescription:
      "Shopify vs WooCommerce compared on cost, control, maintenance and payments — and which failure mode each one has when things go wrong.",
    ...AUTHOR,
    content: `
<p>Both platforms will take money from customers reliably. The difference is what you are responsible for when something goes wrong, and that is where the decision actually lives.</p>

<h2>Shopify: you rent the hard parts</h2>
<p>Payments, PCI compliance, fraud screening, uptime, and security patches are Shopify's problem. That is worth more than it sounds, because those are the parts that ruin your week when they break.</p>
<p>You pay for it in monthly fees, transaction cuts if you use an outside payment provider, and limits on what you can change. When Shopify's checkout does not do what you want, frequently the answer is that it does not do that.</p>

<h2>WooCommerce: you own the hard parts</h2>
<p>Full control of the code, no per-transaction platform fee, and any payment gateway you like. If your store has unusual requirements — complex tax rules, unconventional pricing, a workflow no hosted platform anticipated — you can build it.</p>
<p>The bill arrives as responsibility. Hosting, security, updates, backups and plugin conflicts are yours. A WooCommerce store without someone maintaining it degrades quietly until the day it does not take payments.</p>

<h2>Cost, honestly</h2>
<p>Shopify's cost is predictable and never stops. WooCommerce's is lumpy — lower monthly, but with hosting, plugin licences and maintenance that people routinely leave out when they compare. Over three years the totals are closer than either camp admits.</p>

<h2>How to choose</h2>
<ul>
  <li><strong>No technical person on the team?</strong> Shopify. Do not take on maintenance you cannot perform.</li>
  <li><strong>Already on WordPress and publishing regularly?</strong> WooCommerce keeps one system instead of two.</li>
  <li><strong>Unusual checkout, pricing or tax logic?</strong> WooCommerce, or Shopify Plus if the budget exists.</li>
  <li><strong>Selling internationally at volume?</strong> Shopify’s handling of tax and currency is worth the fee.</li>
</ul>

<h2>The honest summary</h2>
<p>Choose Shopify if you want to sell things. Choose WooCommerce if the way you sell them is unusual enough that a hosted platform will fight you — and you have someone to look after it.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "what-ai-can-actually-do-for-a-small-business",
    title: "What AI Can Actually Do for a Small Business",
    excerpt:
      "Past the hype, a short list of things AI genuinely does well right now — and the ones it will embarrass you with.",
    category: "AI",
    tags: ["AI", "Automation", "LLM", "Small Business"],
    featuredImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    readingTime: 8,
    status: "published",
    featured: true,
    publishedAt: "2026-06-24T09:00:00.000Z",
    seoTitle: "What AI Can Actually Do for a Small Business",
    seoDescription:
      "Where AI genuinely helps a small business today — search, drafting, extraction, triage — and where it fails in ways that cost you money.",
    ...AUTHOR,
    content: `
<p>Two years of noise have made this harder to answer than it should be. Here is the version we would give a client who asked over coffee.</p>

<h2>Where it genuinely works today</h2>

<h3>Searching your own documents</h3>
<p>If your business has years of contracts, manuals or notes, letting someone ask a question in plain language and get the answer <em>with the source</em> is real value. Retrieval keeps it grounded in your documents rather than the model’s imagination.</p>

<h3>First drafts, never final ones</h3>
<p>Useful for the blank page. Not useful for anything that goes out unread — the failure mode is confident, fluent and wrong, which is the hardest kind to catch.</p>

<h3>Pulling structure out of mess</h3>
<p>Invoices, emails, forms, PDFs. Turning unstructured input into structured data is unglamorous and genuinely saves hours, because it is the work nobody wanted.</p>

<h3>Triage</h3>
<p>Routing, tagging and prioritising incoming work. It does not have to be right every time to be useful — it has to be better than an unsorted queue.</p>

<h2>Where it will embarrass you</h2>
<ul>
  <li><strong>Anything requiring correctness without review.</strong> Prices, legal terms, medical or financial specifics. The model does not know when it is wrong.</li>
  <li><strong>Customer-facing chat with no guardrails.</strong> If it can promise a refund policy you do not have, it eventually will.</li>
  <li><strong>Decisions you cannot explain.</strong> If you cannot say why, you cannot defend it to a customer or a regulator.</li>
</ul>

<h2>How to start without wasting money</h2>
<ol>
  <li>Pick one task people currently do by hand, repeatedly, that takes real hours.</li>
  <li>Ship the smallest version to a handful of internal users.</li>
  <li>Measure whether it saved time — honestly, including the checking.</li>
  <li>Only then decide whether it deserves to be a product.</li>
</ol>
<p>The projects that fail are the ones that begin with "we should use AI" instead of "this specific task is painful". The technology is fine. The framing is what sinks it.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "publishing-your-first-app-to-the-play-store",
    title: "Publishing Your First App to the Play Store: What to Expect",
    excerpt:
      "The build is not the hard part. Review, policy and store listing are where first-time publishers lose weeks.",
    category: "Programming",
    tags: ["Play Store", "Android", "App Publishing", "Mobile App Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    readingTime: 7,
    status: "published",
    publishedAt: "2026-07-02T09:00:00.000Z",
    seoTitle: "Publishing Your First App to the Play Store",
    seoDescription:
      "What actually happens when you publish an Android app — review timelines, the policy declarations that cause rejections, and how to prepare a listing.",
    ...AUTHOR,
    content: `
<p>Teams budget for building the app and treat publishing as an afternoon. It is usually the part that slips.</p>

<h2>What actually takes the time</h2>

<h3>Policy declarations</h3>
<p>Google asks what data you collect, why, whether it is shared, and whether it is encrypted. Answering casually is the most common cause of rejection, and the answers must match what your app genuinely does — the review process checks.</p>
<p>Work this out before you submit, not while a rejection is open.</p>

<h3>The listing</h3>
<p>Title, short description, full description, screenshots at several sizes, a feature graphic, an icon, a privacy policy at a live URL. Each is small; together they are a day, and they are on the critical path because you cannot submit without them.</p>

<h3>Review</h3>
<p>First submissions take longer than updates, and new developer accounts get more scrutiny. Plan for days, not hours, and never schedule a launch campaign against an unreviewed build.</p>

<h2>Rejections you can avoid</h2>
<ul>
  <li><strong>Privacy policy missing or unreachable.</strong> It must be live, public, and actually about your app.</li>
  <li><strong>Permissions you cannot justify.</strong> Every permission needs a visible reason in the app.</li>
  <li><strong>Data declarations that do not match behaviour.</strong> If an SDK sends analytics, that is data collection whether or not you wrote the code.</li>
  <li><strong>Screenshots that are not the app.</strong> Marketing mock-ups get rejected.</li>
</ul>

<h2>After launch</h2>
<p>Publishing is the start of an obligation, not the end of a project. Target API levels rise annually and apps that do not keep up stop being distributed to new devices. Budget for maintenance or plan to be delisted eventually.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "do-you-need-an-app-or-a-better-website",
    title: "Do You Need an App, or a Better Website?",
    excerpt:
      "Most businesses asking for an app need a faster website. Here is how to tell which one you are.",
    category: "Business",
    tags: ["Mobile App Development", "Web Development", "Product Strategy"],
    featuredImage:
      "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1600&q=80",
    readingTime: 6,
    status: "published",
    publishedAt: "2026-07-09T09:00:00.000Z",
    seoTitle: "Do You Need an App, or a Better Website?",
    seoDescription:
      "When a mobile app is genuinely worth building versus when a faster, better website solves the same problem for far less.",
    ...AUTHOR,
    content: `
<p>An app is a bigger commitment than most businesses realise when they ask for one: two platforms, two review processes, and a permanent maintenance obligation. Sometimes it is exactly right. Often the honest answer is that a better website solves the same problem for a fraction of the cost.</p>

<h2>Signs you actually need an app</h2>
<ul>
  <li><strong>People use it repeatedly, by habit.</strong> Apps earn their place through frequency. Something used twice a year does not justify a home-screen icon.</li>
  <li><strong>You need hardware the browser cannot reach reliably.</strong> Background location, Bluetooth peripherals, deep offline behaviour.</li>
  <li><strong>Notifications are core, not decorative.</strong> If the product genuinely depends on reaching people, apps do it better.</li>
  <li><strong>It works without a connection.</strong> Field work, travel, warehouses.</li>
</ul>

<h2>Signs a website is the real answer</h2>
<ul>
  <li>You want to be found. Apps are not searchable the way pages are.</li>
  <li>Most visits are first visits. Nobody installs an app to make one enquiry.</li>
  <li>The "app" you describe is your website in a wrapper.</li>
  <li>You have no budget for ongoing maintenance — an unmaintained app eventually stops working; an unmaintained page keeps serving.</li>
</ul>

<h2>The middle option</h2>
<p>A fast, installable web app covers a surprising amount of ground — home-screen presence, offline caching, push on Android — without app stores or two codebases. It is not right for everything, but it is right more often than it gets considered.</p>

<h2>The question that usually settles it</h2>
<p>Would someone install this and open it again next week without being reminded? If you cannot answer yes with confidence, build the website properly first. You can always add the app once you have people who would miss it.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "seo-first-90-days-new-website",
    title: "SEO for a New Website: What to Expect in the First 90 Days",
    excerpt:
      "A realistic timeline for a brand-new site, what to do in what order, and why month one looks like nothing is happening.",
    category: "Marketing",
    tags: ["SEO", "Search Console", "Content Strategy", "New Website"],
    featuredImage:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    readingTime: 8,
    status: "published",
    publishedAt: "2026-07-16T09:00:00.000Z",
    seoTitle: "SEO for a New Website: The First 90 Days",
    seoDescription:
      "What realistically happens to a new site’s search visibility in the first three months, and the order of work that actually moves it.",
    ...AUTHOR,
    content: `
<p>New sites are not ranked slowly out of spite. Google has no evidence about you yet, and evidence takes time to accumulate. Understanding that makes the first three months far less demoralising.</p>

<h2>Month one: be findable at all</h2>
<p>The goal is not ranking. It is being crawled, indexed, and correctly understood.</p>
<ul>
  <li>Verify the site in Search Console and submit the sitemap. Nothing else here matters if you skip this.</li>
  <li>Confirm pages are actually indexed — use URL Inspection rather than assuming.</li>
  <li>Fix anything blocking crawling: stray noindex tags, robots rules, broken canonicals.</li>
  <li>Make sure each page states plainly what it is. Titles and descriptions that read like a human wrote them.</li>
</ul>
<p>Expect close to zero traffic. That is not failure; that is month one.</p>

<h2>Month two: give it something to rank</h2>
<p>A site with five pages has five chances. Most new sites are thin, and thin sites do not get crawled deeply because there is little reason to return.</p>
<p>Publish things only you can write — how you actually work, what you have actually built, decisions you have actually made. Generic content competes with everyone; specific content competes with almost nobody.</p>

<h2>Month three: earn corroboration</h2>
<p>This is where most new sites stall, because it is the part you cannot do alone. Search engines want confirmation from somewhere other than you: a directory listing, a supplier page, a client mentioning the work, a profile on a platform relevant to your field.</p>
<p>One genuine mention from a real source outweighs any amount of self-description.</p>

<h2>What not to do</h2>
<ul>
  <li>Do not buy links. It is detectable and the downside is severe.</li>
  <li>Do not rewrite titles weekly. Changes need time to be measured.</li>
  <li>Do not chase your brand name on day one. If the name is made of ordinary words, that is one of the harder queries to win, not the easiest.</li>
</ul>

<h2>A realistic expectation</h2>
<p>Three months in, a well-built site with genuine content is typically indexed, ranking for its own name, and beginning to appear for long, specific queries. Competitive terms take considerably longer. Anyone promising otherwise is selling something.</p>
`,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "what-devops-means-for-a-small-team",
    title: "What DevOps Actually Means for a Small Team",
    excerpt:
      "You do not need Kubernetes. You need deploys that are boring, a way back, and to know when something breaks.",
    category: "Technology",
    tags: ["DevOps", "CI/CD", "Deployment", "Infrastructure"],
    featuredImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1600&q=80",
    readingTime: 7,
    status: "published",
    publishedAt: "2026-07-23T09:00:00.000Z",
    seoTitle: "What DevOps Actually Means for a Small Team",
    seoDescription:
      "The three things a small team genuinely needs from DevOps — repeatable deploys, a rollback path, and monitoring — without the enterprise tooling.",
    ...AUTHOR,
    content: `
<p>DevOps has been marketed as a stack of tools. For a team of five it is really three properties, and you can have all of them without anything exotic.</p>

<h2>1. Deploying is boring</h2>
<p>If shipping requires a specific person, a checklist, and a quiet afternoon, you will ship rarely — and rare deploys are large deploys, which is precisely when things break.</p>
<p>The fix is that deploys are automatic and identical every time. Merge to main, tests run, it goes out. Once deploying is dull, you do it often, and each change is small enough to reason about.</p>

<h2>2. There is a way back</h2>
<p>The question is not whether you will ship a bad change. It is how long it takes to undo. A team that can roll back in two minutes can take sensible risks; one that cannot becomes afraid of its own codebase.</p>
<p>Test the rollback path before you need it. An untested rollback is a hope, not a plan.</p>

<h2>3. You find out before your customers tell you</h2>
<p>Most small teams learn about outages from a message that starts "is the site down?". Basic uptime checks and error alerting cost almost nothing and change the relationship entirely.</p>
<p>Start with: is it up, are errors spiking, is it slower than usual. That covers most of what actually goes wrong.</p>

<h2>What you can safely ignore for now</h2>
<p>Kubernetes, service meshes, and multi-region failover solve problems you do not have yet. Adopting them early buys operational complexity in exchange for resilience you are not using — and complexity is itself a source of outages.</p>
<p>Managed platforms handle a great deal for small teams. Use them until they genuinely stop fitting, then reassess.</p>

<h2>Where to start</h2>
<ol>
  <li>Automate the deploy — one command or one merge.</li>
  <li>Prove you can roll back, by doing it on purpose.</li>
  <li>Add uptime and error alerts to somewhere people actually look.</li>
  <li>Write down how to deploy and how to revert, for whoever is on call at 2am.</li>
</ol>
<p>That is most of the value, and none of it requires a platform team.</p>
`,
  },
];

/** Look up an article in the built-in catalogue (fallback path only). */
export function getStaticPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
