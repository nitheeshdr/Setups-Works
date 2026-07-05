// Copies the self-hosted TinyMCE assets from node_modules into public/ so the
// rich text editor loads reliably in dev, production, and fresh deploys.
// (public/tinymce is gitignored to keep the repo small; this restores it.)
import { cp, rm } from "fs/promises";
import { existsSync } from "fs";

const src = "node_modules/tinymce";
const dest = "public/tinymce";

if (!existsSync(src)) {
  console.warn("[copy-tinymce] node_modules/tinymce not found — skipping");
  process.exit(0);
}

try {
  await rm(dest, { recursive: true, force: true });
  await cp(src, dest, { recursive: true });
  console.log("[copy-tinymce] ✓ TinyMCE copied to public/tinymce");
} catch (err) {
  console.error("[copy-tinymce] failed:", err);
  // Don't fail the build over this.
  process.exit(0);
}
