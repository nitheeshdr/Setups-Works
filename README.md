<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/white.png" />
    <source media="(prefers-color-scheme: light)" srcset="./public/black.png" />
    <img src="./public/black.png" alt="Setups Works logo" width="160" />
  </picture>

  <h1>Setups Works</h1>

  <p><strong>The Digital Agency.</strong></p>
  <p>The official website and content platform for Setups Works, a premium digital agency crafting high-performance websites, web and mobile apps, AI products, and brand experiences that move businesses forward.</p>

  <p>
    <a href="https://setups.works">Live Site</a>
    &nbsp;&middot;&nbsp;
    <a href="#getting-started">Getting Started</a>
    &nbsp;&middot;&nbsp;
    <a href="#features">Features</a>
    &nbsp;&middot;&nbsp;
    <a href="#project-structure">Structure</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black.svg" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-149eca.svg" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6.svg" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47a248.svg" alt="MongoDB" />
  </p>
</div>

---

## Overview

This repository contains the full source for the Setups Works website: a marketing site and a self-contained content management system in a single Next.js application. It powers the public-facing pages (services, portfolio, case studies, products, blog, and careers) and an authenticated admin panel used to manage that content.

The application is built on the Next.js App Router with a MongoDB backend, Cloudinary for media, a rich-text editor for authoring, and a structured-data layer engineered for search visibility and entity recognition.

- **Live site:** https://setups.works

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Content Management](#content-management)
- [Search and Structured Data](#search-and-structured-data)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Author](#author)

## Features

**Public website**

- Marketing pages for services, portfolio, case studies, products, careers, and company information.
- A full blog with categories, tags, reading time, and rich media.
- Contact and enquiry forms with email delivery.
- Site-wide search across content.
- Motion and 3D-enhanced interfaces using GSAP, Framer Motion, Lenis smooth scrolling, and Three.js.
- Light and dark theming.

**Admin and content management**

- Authenticated admin panel for managing all site content.
- Rich-text authoring with an embedded editor.
- Cloudinary-backed media uploads and optimization.
- Database seeding scripts for local development and initial setup.

**Engineering**

- Fully typed codebase with strict TypeScript.
- Server-rendered and statically optimized routes via the App Router.
- Reusable, accessible UI primitives built on Radix UI.
- Form handling and validation with React Hook Form and Zod.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, next-themes |
| Database | MongoDB with Mongoose |
| Media | Cloudinary |
| Authentication | JWT-based sessions with bcrypt password hashing |
| Content editor | TinyMCE |
| Email | Nodemailer (SMTP) |
| Data and forms | TanStack React Query, Axios, React Hook Form, Zod |
| Animation and 3D | GSAP, Framer Motion, Lenis, Three.js, React Three Fiber, OGL |
| UI | Radix UI, Lucide, React Icons, Font Awesome, Sonner, cmdk |

## Getting Started

### Prerequisites

- Node.js 20 or later
- A package manager (pnpm recommended; npm or yarn also supported)
- A MongoDB connection string (local or hosted, for example MongoDB Atlas)
- A Cloudinary account for media handling

### Installation

~~~bash
# 1. Clone the repository
git clone https://github.com/nitheeshdr/Setups-Works.git
cd "Setups Works"

# 2. Install dependencies
pnpm install

# 3. Create your environment file
cp .env.example .env.local

# 4. Fill in the environment variables (see the table below)

# 5. Seed the database with initial content (optional)
pnpm seed

# 6. Start the development server
pnpm dev
~~~

The site will be available at `http://localhost:3000`, and the admin panel at `http://localhost:3000/admin`.

## Environment Variables

Create a `.env.local` file in the project root using the keys below. See `.env.example` for the authoritative list.

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign admin session tokens |
| `NEXT_PUBLIC_SITE_URL` | Public base URL of the site, for example `http://localhost:3000` |
| `ADMIN_EMAIL` | Email for the initial admin account |
| `ADMIN_PASSWORD` | Password for the initial admin account |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GROQ_API_KEY` | API key for AI-assisted features |
| `GROQ_MODEL` | Model identifier for AI features |
| `SMTP_HOST` | SMTP server host for outgoing email |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From address for outgoing email |
| `SMTP_TO` | Destination address for enquiry and contact forms |

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm seed` | Seed the database with initial content |
| `pnpm seed:wipe` | Wipe and reseed the database |
| `pnpm typecheck` | Run the TypeScript compiler with no emit |

## Content Management

All site content is managed through the authenticated admin panel at `/admin`. The initial administrator account is provisioned from the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Content authoring uses an embedded rich-text editor, and media is uploaded to and served from Cloudinary.

## Search and Structured Data

The site includes a dedicated SEO layer:

- A generated `sitemap.xml` and `robots.txt`.
- Open Graph and social metadata, including a dynamic Open Graph image.
- A comprehensive JSON-LD structured-data implementation covering the organization, its founder, website, breadcrumbs, articles, products, services, and portfolio work. The organization and local-business signals are unified into a single business entity, the founder is modelled as a distinct linked person, and both entities are linked to their Wikidata identifiers for search-engine entity recognition.

## Project Structure

~~~text
Setups Works/
├── public/               Static assets, including logos and icons
├── scripts/              Database seeding and build helper scripts
├── src/
│   ├── app/
│   │   ├── (marketing)/  Public pages (about, blog, portfolio, services, ...)
│   │   ├── admin/        Authenticated admin panel
│   │   ├── api/          Route handlers
│   │   ├── sitemap.ts    SEO endpoints (sitemap, robots, manifest)
│   │   └── layout.tsx
│   ├── components/       Reusable UI and section components
│   ├── data/            Static content and configuration
│   ├── lib/             Utilities, database, and integrations
│   ├── models/          Mongoose data models
│   └── middleware.ts    Route middleware
├── .env.example         Example environment configuration
└── README.md
~~~

## Deployment

The application is optimized for deployment on Vercel.

1. Push the repository to your Git provider.
2. Import the project into Vercel.
3. Configure the environment variables in the Vercel project settings.
4. Deploy.

Any platform that supports Next.js 15 can host the application, provided the MongoDB, Cloudinary, and SMTP services are reachable from the deployment environment.

## License

This project is proprietary. All rights reserved by Setups Works. It is not licensed for redistribution or reuse without prior written permission.

## Author

**Nitheesh Rajendran** — Founder, Setups Works

- Website: https://setups.works
- Email: info@setups.works

Designed and built by Setups Works, a digital agency crafting high-performance websites, web and mobile apps, AI products, and brand experiences.
