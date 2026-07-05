import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faCube,
  faBriefcase,
  faComments,
  faEnvelope,
  faUsers,
  faArrowRight,
  faPlus,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { connectDB } from "@/lib/db";
import { Blog, Product, Portfolio, Testimonial, Contact, Subscriber } from "@/models";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/helpers";

export const dynamic = "force-dynamic";

async function getStats() {
  const conn = await connectDB();
  if (!conn) {
    return { counts: null, recentMessages: [], recentBlogs: [] };
  }
  const [blogs, products, portfolio, testimonials, messages, subscribers, unread] =
    await Promise.all([
      Blog.estimatedDocumentCount(),
      Product.estimatedDocumentCount(),
      Portfolio.estimatedDocumentCount(),
      Testimonial.estimatedDocumentCount(),
      Contact.estimatedDocumentCount(),
      Subscriber.estimatedDocumentCount(),
      Contact.countDocuments({ replied: false }),
    ]);
  const recentMessages = JSON.parse(
    JSON.stringify(await Contact.find().sort({ createdAt: -1 }).limit(5).lean()),
  );
  const recentBlogs = JSON.parse(
    JSON.stringify(await Blog.find().sort({ createdAt: -1 }).limit(5).lean()),
  );
  return {
    counts: { blogs, products, portfolio, testimonials, messages, subscribers, unread },
    recentMessages,
    recentBlogs,
  };
}

const cards = [
  { key: "blogs", label: "Blog Posts", icon: faNewspaper, href: "/admin/blogs", color: "text-brand-500 bg-brand-500/10" },
  { key: "products", label: "Products", icon: faCube, href: "/admin/products", color: "text-violet-500 bg-violet-500/10" },
  { key: "portfolio", label: "Projects", icon: faBriefcase, href: "/admin/portfolio", color: "text-emerald-500 bg-emerald-500/10" },
  { key: "testimonials", label: "Testimonials", icon: faComments, href: "/admin/testimonials", color: "text-amber-500 bg-amber-500/10" },
  { key: "messages", label: "Messages", icon: faEnvelope, href: "/admin/messages", color: "text-rose-500 bg-rose-500/10" },
  { key: "subscribers", label: "Subscribers", icon: faUsers, href: "/admin/subscribers", color: "text-sky-500 bg-sky-500/10" },
] as const;

const quickActions = [
  { label: "New blog post", href: "/admin/blogs/new" },
  { label: "New product", href: "/admin/products/new" },
  { label: "New project", href: "/admin/portfolio/new" },
  { label: "New testimonial", href: "/admin/testimonials/new" },
];

export default async function AdminDashboard() {
  const [{ counts, recentMessages, recentBlogs }, user] = await Promise.all([
    getStats(),
    getSession(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening across your site.
        </p>
      </div>

      {!counts && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm">
          Could not connect to the database. Check your <code>MONGODB_URI</code>.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-brand-500/40"
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-11 place-items-center rounded-xl ${c.color}`}>
                <FontAwesomeIcon icon={c.icon} className="size-5" />
              </span>
              {c.key === "messages" && counts?.unread ? (
                <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-500">
                  {counts.unread} new
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight">
              {counts ? (counts[c.key] as number) : "—"}
            </p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <p className="mb-4 text-sm font-semibold">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand-500/40"
            >
              <FontAwesomeIcon icon={faPlus} className="size-3 text-brand-500" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent messages */}
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Recent messages</p>
            <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500">
              View all <FontAwesomeIcon icon={faArrowRight} className="size-2.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No messages yet.</p>
            )}
            {recentMessages.map((m: { _id: string; name: string; subject: string; replied: boolean; createdAt: string }) => (
              <div key={m._id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/40 p-3">
                {!m.replied && <FontAwesomeIcon icon={faCircle} className="size-2 text-brand-500" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent blogs */}
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Recent posts</p>
            <Link href="/admin/blogs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500">
              View all <FontAwesomeIcon icon={faArrowRight} className="size-2.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBlogs.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No posts yet.</p>
            )}
            {recentBlogs.map((b: { _id: string; title: string; status: string; createdAt: string }) => (
              <Link key={b._id} href={`/admin/blogs/${b._id}`} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/40 p-3 transition-colors hover:border-brand-500/40">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="text-xs capitalize text-muted-foreground">{b.status}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(b.createdAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
