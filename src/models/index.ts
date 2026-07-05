import mongoose, { Schema, model, models } from "mongoose";

/* ------------------------------------------------------------------ *
 *  User (admin auth)
 * ------------------------------------------------------------------ */
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    avatar: String,
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Blog
 * ------------------------------------------------------------------ */
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    featuredImage: { type: String, default: "" },
    author: { type: String, default: "Setups Works" },
    authorRole: String,
    authorAvatar: String,
    seoTitle: String,
    seoDescription: String,
    ogImage: String,
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 5 },
    publishedAt: Date,
  },
  { timestamps: true },
);
BlogSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

/* ------------------------------------------------------------------ *
 *  Product
 * ------------------------------------------------------------------ */
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    screenshots: { type: [String], default: [] },
    features: {
      type: [{ title: String, description: String, icon: String }],
      default: [],
    },
    technologies: { type: [String], default: [] },
    category: { type: String, default: "Software" },
    status: {
      type: String,
      enum: ["coming-soon", "beta", "live", "archived"],
      default: "coming-soon",
    },
    version: String,
    downloadLink: String,
    githubLink: String,
    docsLink: String,
    releaseNotes: String,
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Portfolio
 * ------------------------------------------------------------------ */
const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    summary: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    images: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    liveDemo: String,
    github: String,
    client: { type: String, default: "" },
    duration: { type: String, default: "" },
    year: { type: String, default: "" },
    caseStudy: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Testimonial
 * ------------------------------------------------------------------ */
const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    photo: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    review: { type: String, required: true },
    showOnHome: { type: Boolean, default: true },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Contact message
 * ------------------------------------------------------------------ */
const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    budget: String,
    subject: { type: String, default: "New inquiry" },
    message: { type: String, required: true },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Newsletter subscriber
 * ------------------------------------------------------------------ */
const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Settings (singleton)
 * ------------------------------------------------------------------ */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    siteName: { type: String, default: "Setups Works" },
    tagline: { type: String, default: "The Digital Agency." },
    description: String,
    email: String,
    phone: String,
    location: String,
    social: {
      twitter: String,
      github: String,
      linkedin: String,
      dribbble: String,
      instagram: String,
    },
    seo: {
      title: String,
      description: String,
      ogImage: String,
      keywords: [String],
    },
    analytics: {
      googleAnalyticsId: String,
      searchConsoleId: String,
    },
    founder: {
      name: { type: String, default: "Nitheesh R." },
      role: { type: String, default: "Founder & Principal Engineer" },
      handle: { type: String, default: "setupsworks" },
      status: { type: String, default: "Available" },
      photo: { type: String, default: "" },
      quote: {
        type: String,
        default:
          "I started Setups Works because I was tired of seeing great ideas ruined by mediocre execution. We treat every project like it's our own product.",
      },
      bio: { type: String, default: "" },
      twitter: String,
      linkedin: String,
    },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Client logo (homepage marquee)
 * ------------------------------------------------------------------ */
const ClientLogoSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    url: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/* ------------------------------------------------------------------ *
 *  Milestone (About page journey timeline)
 * ------------------------------------------------------------------ */
const MilestoneSchema = new Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const User = models.User || model("User", UserSchema);
export const ClientLogo = models.ClientLogo || model("ClientLogo", ClientLogoSchema);
export const Milestone = models.Milestone || model("Milestone", MilestoneSchema);
export const Blog = models.Blog || model("Blog", BlogSchema);
export const Product = models.Product || model("Product", ProductSchema);
export const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);
export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
export const Contact = models.Contact || model("Contact", ContactSchema);
export const Subscriber = models.Subscriber || model("Subscriber", SubscriberSchema);
export const Settings = models.Settings || model("Settings", SettingsSchema);

export type { mongoose };
