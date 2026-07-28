/**
 * Imports the built-in article catalogue into MongoDB so posts are editable
 * from /admin/blogs.
 *
 *   pnpm seed:blogs         → insert any post whose slug isn't in the DB
 *   pnpm seed:blogs --force → also overwrite posts that already exist
 *
 * Idempotent by default: re-running will not clobber edits made in the admin,
 * because an existing slug is skipped unless --force is passed.
 *
 * Seeding is what makes the posts appear in the admin. The public site renders
 * them either way — `getBlogs` falls back to the same catalogue when the
 * collection is empty — but the admin reads the database directly, by design:
 * showing rows there that cannot be edited would be worse than showing none.
 */
import mongoose from "mongoose";
import { Blog } from "../src/models/index";
import { blogPosts } from "../src/data/blog-posts";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/setupsworks";
const FORCE = process.argv.includes("--force");

async function main() {
  console.log("→ Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("✓ Connected");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of blogPosts) {
    const existing = await Blog.findOne({ slug: post.slug });

    if (existing && !FORCE) {
      skipped++;
      continue;
    }

    const doc = {
      ...post,
      // Mongoose wants a Date; the catalogue stores an ISO string.
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      status: "published" as const,
    };

    if (existing) {
      await Blog.updateOne({ slug: post.slug }, doc);
      updated++;
    } else {
      await Blog.create(doc);
      created++;
    }
  }

  console.log(
    `✓ Blogs — created: ${created}, updated: ${updated}, skipped: ${skipped}`,
  );
  if (skipped > 0 && !FORCE) {
    console.log("  (existing slugs left untouched; pass --force to overwrite)");
  }

  await mongoose.disconnect();
  console.log("✓ Done");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
