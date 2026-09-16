import mongoose from "mongoose";

let connecting = null;

// Production (Vercel) uses DATABASE_URL (MongoDB Atlas).
// Local dev without DATABASE_URL falls back to an ephemeral in-memory
// MongoDB so `npm run dev` works with zero setup.
export async function connectDB(url) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connecting) {
    if (url) {
      connecting = mongoose.connect(url);
    } else {
      console.warn("[db] DATABASE_URL not set — ephemeral in-memory Mongo (resets on restart)");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      connecting = mongoose.connect(mongod.getUri());
    }
  }
  await connecting;
  return mongoose.connection;
}
