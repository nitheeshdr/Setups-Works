import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { BlogCard } from "@/components/cards";
import type { Blog } from "@/lib/types";

export function BlogPreview({ blogs }: { blogs: Blog[] }) {
  if (!blogs.length) return null;
  return (
    <Section className="relative">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="From the blog"
            title="Ideas worth reading"
            description="Deep dives on engineering, design, and building great digital products."
          />
          <Reveal>
            <Link
              href="/blog"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-500/40"
            >
              All articles
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {blogs.slice(0, 3).map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.08}>
              <BlogCard blog={b} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
