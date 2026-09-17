import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

await connectDB(env.databaseUrl);

const app = createApp();

app.listen(env.port, () => {
  console.log(`FlowBoard API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
