/**
 * Init script — ensures the admin user and settings exist.
 * Does NOT insert demo content (publish your own via the admin CMS).
 *
 *   pnpm seed          → ensure admin user + settings
 *   pnpm seed --wipe   → also delete ALL content (blogs, products, portfolio,
 *                        testimonials, messages, subscribers). Admin is kept.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User,
  Blog,
  Product,
  Portfolio,
  Testimonial,
  Contact,
  Subscriber,
  Settings,
} from "../src/models/index";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/setupsworks";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@setupsworks.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const WIPE = process.argv.includes("--wipe");

async function main() {
  console.log("→ Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("✓ Connected");

  // Admin user (upsert — never wiped)
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      name: "Setups Works Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: hash,
      role: "admin",
    },
    { upsert: true, returnDocument: "after" },
  );
  console.log(`✓ Admin user ready → ${ADMIN_EMAIL}`);

  // Settings singleton
  await Settings.findOneAndUpdate(
    { key: "site" },
    { key: "site", siteName: "Setups Works", tagline: "The Digital Agency." },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
  console.log("✓ Settings ready");

  if (WIPE) {
    const [b, p, pf, t, c, s] = await Promise.all([
      Blog.deleteMany({}),
      Product.deleteMany({}),
      Portfolio.deleteMany({}),
      Testimonial.deleteMany({}),
      Contact.deleteMany({}),
      Subscriber.deleteMany({}),
    ]);
    console.log(
      `🧹 Wiped content — blogs:${b.deletedCount} products:${p.deletedCount} portfolio:${pf.deletedCount} testimonials:${t.deletedCount} messages:${c.deletedCount} subscribers:${s.deletedCount}`,
    );
  }

  await mongoose.disconnect();
  console.log("✅ Done");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Failed:", err);
  process.exit(1);
});
