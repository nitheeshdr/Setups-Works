import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/setupsworks";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

/**
 * Connects to MongoDB with a cached, hot-reload-safe connection.
 * Returns null (instead of throwing) if the DB is unreachable, so the
 * public site can gracefully fall back to seed content.
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[db] MongoDB connection failed:", (err as Error).message);
    return null;
  }
}

/** Throwing variant for admin/API routes that require a database. */
export async function requireDB(): Promise<typeof mongoose> {
  const conn = await connectDB();
  if (!conn) throw new Error("Database connection unavailable");
  return conn;
}
