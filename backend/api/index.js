// Vercel serverless entry — wraps the same Express app used locally.
// `vercel.json` rewrites every request here; Express still sees the original path.
import { createApp } from "../src/app.js";

const app = createApp();

export default app;
