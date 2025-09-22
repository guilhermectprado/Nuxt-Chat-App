// app/plugins/socket.client.ts - NUXT 4 CORRIGIDO
import { io, type Socket } from "socket.io-client";

interface SocketMethods {
  ping: () => boolean;
  authenticate: (userId: string) => boolean;
  joinChat: (chatId: string, userId: string) => boolean;
  sendMessage: (chatId: string, message: any) => boolean;
  startTyping: (chatId: string, userId: string, userName: string) => void;
  stopTyping: (chatId: string, userId: string) => void;
  updateStatus: (status: "online" | "offline") => void;
  isConnected: () => boolean;
  getSocketId: () => string | null;
  reconnect: () => void;
  disconnect: () => void;
}

export default defineNuxtPlugin(() => {
  let socket: Socket | null = null;

  if (import.meta.client) {
    const config = useRuntimeConfig();

    // Tentar conectar na porta 3000 (Nuxt) primeiro, depois 3001 (Socket.IO separado)
    // const socketUrls = config.public.socketUrl;
    // let currentUrlIndex = 0;

    const connectToSocket = () => {
      // const socketUrl = socketUrls[currentUrlIndex];
      const socketUrl = config.public.socketUrl;
      console.log(`🔌 Tentando conectar Socket.IO em: ${socketUrl}`);

      socket = io(socketUrl, {
        autoConnect: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
        forceNew: false,
      });

      // Event listeners
      socket.on("connect", () => {
        console.log("✅ Socket conectado no Nuxt 4!");
        console.log("🆔 Socket ID:", socket?.id);
        console.log("🌐 URL:", socketUrl);
        console.log("🚀 Transport:", socket?.io.engine.transport.name);

        // Teste imediato
        socket?.emit("ping");
      });

      socket.on("pong", (data) => {
        console.log("🏓 Pong recebido:", data);
        console.log("✨ Socket.IO funcionando perfeitamente!");
      });

      socket.on("connect_error", (error: any) => {
        console.error(`🚨 Erro de conexão em ${socketUrl}:`, error.message);

        // Tentar próxima URL
        // if (currentUrlIndex < socketUrls.length - 1) {
        //   currentUrlIndex++;
        //   console.log("🔄 Tentando próxima URL...");
        //   socket?.disconnect();
        //   setTimeout(connectToSocket, 1000);
        // } else {
        //   console.error("💀 Todas as URLs falharam");
        // }
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Socket desconectado:", reason);
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Reconectado na tentativa:", attemptNumber);
      });

      socket.on("reconnect_attempt", (attemptNumber) => {
        console.log("🔄 Tentativa de reconexão:", attemptNumber);
      });

      // App-specific events
      socket.on("authenticated", (data) => {
        console.log("🔐 Autenticado:", data);
      });

      socket.on("chat-joined", (data) => {
        console.log("🚀 Entrou no chat:", data);
      });

      socket.on("message-sent", (data) => {
        console.log("📤 Mensagem enviada:", data);
      });

      socket.on("new-message", (message) => {
        console.log("📥 Nova mensagem:", message);
      });

      socket.on("user-joined", (data) => {
        console.log("👋 Usuário entrou:", data);
      });

      socket.on("user-left", (data) => {
        console.log("👋 Usuário saiu:", data);
      });

      socket.on("user-typing", (data) => {
        console.log("⌨️ Usuário digitando:", data);
      });

      socket.on("user-status-changed", (data) => {
        console.log("🔄 Status mudou:", data);
      });
    };

    connectToSocket();

    // Socket methods
    const socketMethods: SocketMethods = {
      ping: () => {
        if (socket?.connected) {
          socket.emit("ping");
          return true;
        }
        console.warn("⚠️ Socket não conectado para ping");
        return false;
      },

      authenticate: (userId: string) => {
        if (socket?.connected) {
          socket.emit("authenticate", userId);
          return true;
        }
        console.warn("⚠️ Socket não conectado para autenticação");
        return false;
      },

      joinChat: (chatId: string, userId: string) => {
        if (socket?.connected) {
          socket.emit("join-chat", { chatId, userId });
          return true;
        }
        console.warn("⚠️ Socket não conectado para entrar no chat");
        return false;
      },

      sendMessage: (chatId: string, message: any) => {
        if (socket?.connected) {
          socket.emit("send-message", { chatId, message });
          return true;
        }
        console.warn("⚠️ Socket não conectado para enviar mensagem");
        return false;
      },

      startTyping: (chatId: string, userId: string, userName: string) => {
        if (socket?.connected) {
          socket.emit("typing-start", { chatId, userId, userName });
        }
      },

      stopTyping: (chatId: string, userId: string) => {
        if (socket?.connected) {
          socket.emit("typing-stop", { chatId, userId });
        }
      },

      updateStatus: (status: "online" | "offline") => {
        if (socket?.connected) {
          socket.emit("update-status", status);
        }
      },

      isConnected: () => socket?.connected || false,
      getSocketId: () => socket?.id || null,

      reconnect: () => {
        if (socket && !socket.connected) {
          socket.connect();
        }
      },

      disconnect: () => {
        if (socket?.connected) {
          socket.disconnect();
        }
      },
    };

    // Cleanup
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        socketMethods.updateStatus("offline");
        socket?.disconnect();
      });
    }

    return {
      provide: {
        socket,
        socketMethods,
      },
    };
  }

  // Server-side fallback
  const fallbackMethods: SocketMethods = {
    ping: () => false,
    authenticate: () => false,
    joinChat: () => false,
    sendMessage: () => false,
    startTyping: () => {},
    stopTyping: () => {},
    updateStatus: () => {},
    isConnected: () => false,
    getSocketId: () => null,
    reconnect: () => {},
    disconnect: () => {},
  };

  return {
    provide: {
      socket: null,
      socketMethods: fallbackMethods,
    },
  };
});
