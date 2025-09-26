// server/middleware/database.ts

import { connectDB } from "../lib/db";

export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith("/api/")) {
    await connectDB();
  }
});
