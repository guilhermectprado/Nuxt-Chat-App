// app/plugins/socket.client.ts - SIMPLIFICADO CORRIGIDO
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

// Função para acessar o socket globalmente
export function getSocket(): Socket | null {
  return socket;
}

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const config = useRuntimeConfig();
    const socketUrl = config.public.socketUrl;

    console.log(`🔌 Conectando Socket.IO em: ${socketUrl}`);

    socket = io(socketUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    // Event listeners básicos
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket desconectado:", reason);
    });

    socket.on("connect_error", (error: any) => {
      console.error("🚨 Erro de conexão:", error.message);
    });

    // Cleanup
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        socket?.disconnect();
      });
    }
  }

  return {
    provide: {
      socket,
    },
  };
});
