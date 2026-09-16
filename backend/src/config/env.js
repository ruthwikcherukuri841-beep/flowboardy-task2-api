import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  // Reserved for the database milestone (Task 3)
  databaseUrl: process.env.DATABASE_URL ?? "",
};
