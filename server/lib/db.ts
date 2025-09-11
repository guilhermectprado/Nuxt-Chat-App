import mongoose from "mongoose";

const config = useRuntimeConfig();

// Cache da conexão para evitar múltiplas conexões
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Usando conexão MongoDB existente");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(config.MONGODB_URI as string, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ MongoDB conectado: ${cached.conn.connection.host}`);
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB erro de conexão", error);
    throw error;
  }

  return cached.conn;
};
