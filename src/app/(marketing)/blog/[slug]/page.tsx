import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar, faArrowLeft, faTag } from "@fortawesome/free-solid-svg-icons";
import { Container, Section } from "@/components/section";
import { AuroraBackground, GridGlow } from "@/components/backgrounds";
import { Reveal } from "@/components/motion-primitives";
import { BlogCard } from "@/components/cards";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { getAllBlogSlugs, getBlogBySlug, getRelatedBlogs } from "@/lib/content";
import { formatDate } from "@/lib/helpers";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post not found" };
  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    alternates: { canonical: `/blog/${blog.slug}` },
    keywords: blog.tags,
    authors: [{ name: blog.author }],
    openGraph: {
      type: "article",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      url: `/blog/${blog.slug}`,
      images: [blog.ogImage || blog.featuredImage],
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt ?? blog.publishedAt,
      authors: [blog.author],
      tags: blog.tags,
      section: blog.category,
    },
    twitter: { card: "summary_large_image", images: [blog.ogImage || blog.featuredImage] },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  const related = await getRelatedBlogs(blog, 3);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(blog),
          breadcrumbSchema([
            { name: "Blog", url: "/blog" },
            { name: blog.title, url: `/blog/${blog.slug}` },
          ]),
        ]}
      />

      <article>
        <section className="relative isolate overflow-hidden pb-10 pt-28 sm:pt-32">
          <AuroraBackground opacity={0.35} />
          <GridGlow />
          <Container className="relative max-w-3xl">
            <Reveal>
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="size-3" />
                Back to blog
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
                {blog.category}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
                {blog.title}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2.5">
                  {blog.authorAvatar && (
                    <Image
                      src={blog.authorAvatar}
                      alt={blog.author}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                  )}
                  <span>
                    <span className="block font-medium text-foreground">{blog.author}</span>
                    {blog.authorRole && <span className="text-xs">{blog.authorRole}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendar} className="size-3.5" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} className="size-3.5" />
                  {blog.readingTime} min read
                </span>
              </div>
            </Reveal>
          </Container>
        </section>

        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-border/60">
              <Image src={blog.featuredImage} alt={blog.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
        </Container>

        <Section className="py-14">
          <Container className="max-w-3xl">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/60 pt-8">
                <FontAwesomeIcon icon={faTag} className="size-3.5 text-muted-foreground" />
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border/60 bg-surface-2/60 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-brand-500"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </article>

      {related.length > 0 && (
        <Section className="border-t border-border/60 py-14">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              Related articles
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((b, i) => (
                <Reveal key={b.slug} delay={i * 0.08}>
                  <BlogCard blog={b} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
