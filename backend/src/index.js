import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { seedIfEmpty } from "./seed.js";

await connectDB(env.databaseUrl);
await seedIfEmpty();

const app = createApp();

app.listen(env.port, () => {
  console.log(`FlowBoard API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
