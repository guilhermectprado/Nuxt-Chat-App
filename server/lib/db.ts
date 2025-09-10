import mongoose from "mongoose";
const config = useRuntimeConfig();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI as string);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB erro de conexão", error);
  }
};
