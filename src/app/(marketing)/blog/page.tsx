import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { BlogExplorer } from "@/components/blog-explorer";
import { getBlogs, getBlogCategories } from "@/lib/content";
import { JsonLd, pageSchemas } from "@/components/seo/json-ld";

const description =
  "Deep dives on engineering, design, AI, and building great digital products from the team at Setups Works.";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog",
  description,
};

export const revalidate = 300;

export default async function BlogPage() {
  const [{ items }, categories] = await Promise.all([
    getBlogs({ limit: 100 }),
    getBlogCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={pageSchemas({ path: "/blog", label: "Blog", description })}
      />
      <PageHeader
        eyebrow="The blog"
        title="Ideas, engineering & design"
        description="Lessons from the trenches of building premium software — written by the people who ship it."
        crumbs={[{ label: "Blog" }]}
      />

      <Section>
        <Container>
          <BlogExplorer blogs={items} categories={categories} />
        </Container>
      </Section>
    </>
  );
}
