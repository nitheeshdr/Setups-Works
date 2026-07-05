import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local";
}

/** Uploads a file buffer to Cloudinary (if configured) or local /public/uploads. */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  if (hasCloudinary) {
    const dataUri = `data:image/${
      path.extname(filename).slice(1) || "png"
    };base64,${buffer.toString("base64")}`;
    const res = await cloudinary.uploader.upload(dataUri, {
      folder: "setupsworks",
      resource_type: "image",
    });
    return { url: res.secure_url, provider: "cloudinary" };
  }

  // Local fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(filename) || ".png";
  const name = `${randomUUID()}${ext}`;
  await writeFile(path.join(uploadsDir, name), buffer);
  return { url: `/uploads/${name}`, provider: "local" };
}
