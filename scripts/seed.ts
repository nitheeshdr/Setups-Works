/**
 * Seed script — populates MongoDB with demo content + an admin user.
 * Run with:  pnpm seed
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User,
  Blog,
  Product,
  Portfolio,
  Testimonial,
  Settings,
} from "../src/models/index";
import {
  seedBlogs,
  seedProducts,
  seedPortfolio,
  seedTestimonials,
} from "../src/data/seed-content";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/setupsworks";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@setupsworks.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

async function main() {
  console.log("→ Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("✓ Connected");

  // Admin user (upsert)
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      name: "SETUPS WORKS Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: hash,
      role: "admin",
    },
    { upsert: true, new: true },
  );
  console.log(`✓ Admin user ready → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // Content — wipe and reinsert
  await Blog.deleteMany({});
  await Blog.insertMany(seedBlogs);
  console.log(`✓ ${seedBlogs.length} blog posts`);

  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log(`✓ ${seedProducts.length} product(s)`);

  await Portfolio.deleteMany({});
  await Portfolio.insertMany(seedPortfolio);
  console.log(`✓ ${seedPortfolio.length} portfolio projects`);

  await Testimonial.deleteMany({});
  await Testimonial.insertMany(seedTestimonials);
  console.log(`✓ ${seedTestimonials.length} testimonials`);

  await Settings.findOneAndUpdate(
    { key: "site" },
    {
      key: "site",
      siteName: "SETUPS WORKS",
      tagline: "The Digital Agency.",
      description:
        "SETUPS WORKS is a premium digital agency crafting high-performance websites, apps, AI products, and brands.",
      email: "hello@setupsworks.com",
      phone: "+1 (415) 555-0142",
      location: "Remote · Worldwide",
      social: {
        twitter: "https://twitter.com/setupsworks",
        github: "https://github.com/setupsworks",
        linkedin: "https://linkedin.com/company/setupsworks",
        dribbble: "https://dribbble.com/setupsworks",
        instagram: "https://instagram.com/setupsworks",
      },
    },
    { upsert: true, new: true },
  );
  console.log("✓ Settings initialized");

  await mongoose.disconnect();
  console.log("✅ Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
