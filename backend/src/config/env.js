import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "flowboard-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  demoEmail: process.env.DEMO_EMAIL ?? "demo@flowboard.app",
  demoPassword: process.env.DEMO_PASSWORD ?? "demo1234",
};
