import { io, type Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {
  let socket: Socket | null = null;

  if (process.client) {
    // Conecta na mesma porta do Nuxt (3000)
    socket = io("http://localhost:3000", {
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket conectado ao Nitro:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket desconectado:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Erro de conexão Socket:", error);
    });
  }

  return {
    provide: {
      socket,
    },
  };
});
