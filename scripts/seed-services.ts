/**
 * Imports the built-in service catalogue into MongoDB so it can be edited from
 * /admin/services.
 *
 *   pnpm seed:services         → insert any service whose slug isn't in the DB
 *   pnpm seed:services --force → also overwrite services that already exist
 *
 * Idempotent by default: re-running it will not clobber edits made in the
 * admin, because an existing slug is skipped unless --force is passed.
 *
 * Seeding is optional — `getServices()` falls back to the same catalogue when
 * the collection is empty, so the site renders correctly before this ever runs.
 * Seed when you want to start editing services from the admin.
 */
import mongoose from "mongoose";
import { Service } from "../src/models/index";
import { services } from "../src/data/services";

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

  for (const s of services) {
    const existing = await Service.findOne({ slug: s.slug });

    if (existing && !FORCE) {
      skipped++;
      continue;
    }

    const doc = {
      ...s,
      status: "published" as const,
    };

    if (existing) {
      await Service.updateOne({ slug: s.slug }, doc);
      updated++;
    } else {
      await Service.create(doc);
      created++;
    }
  }

  console.log(
    `✓ Services — created: ${created}, updated: ${updated}, skipped: ${skipped}`,
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
