// server/plugins/mongo.ts
import { connectDB } from "../lib/db";

export default defineNitroPlugin(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB conectado via plugin");
  } catch (error) {
    console.error("❌ Falha ao conectar MongoDB:", error);
  }
});
