// server/plugins/socket.ts - NUXT 4 CORRIGIDO
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import type { NitroApp } from "nitropack";

let io: SocketIOServer;
let httpServer: any;
const connectedUsers = new Map<string, string>();

export default async (nitroApp: NitroApp) => {
  console.log("⚡ Inicializando Socket.IO para Nuxt 4...");

  // Método 1: Tentar usar o servidor HTTP do Nitro
  nitroApp.hooks.hook("request", async (event) => {
    if (!io && event.node.req.socket) {
      try {
        // Cast para any para evitar erro TypeScript
        const reqSocket = event.node.req.socket as any;
        if (reqSocket.server) {
          console.log("🔌 Encontrou servidor HTTP do Nitro");
          setupSocketServer(reqSocket.server);
        }
      } catch (error) {
        console.log("⚠️ Método 1 falhou, tentando método alternativo...");
      }
    }
  });

  // Método 2: Criar servidor HTTP separado na porta 3001
  // setTimeout(() => {
  //   if (!io) {
  //     console.log("🔄 Criando servidor HTTP separado para Socket.IO...");
  //     httpServer = createServer();

  //     httpServer.listen(3001, () => {
  //       console.log("🚀 Servidor Socket.IO rodando na porta 3001");
  //     });

  //     setupSocketServer(httpServer);
  //   }
  // }, 1000);

  // Hook de cleanup
  nitroApp.hooks.hook("close", async () => {
    if (io) {
      io.close();
      console.log("🔴 Socket.IO fechado");
    }
    if (httpServer) {
      httpServer.close();
      console.log("🔴 Servidor HTTP fechado");
    }
  });
};

function setupSocketServer(server: any) {
  if (io) return; // Já foi configurado

  console.log("🔧 Configurando servidor Socket.IO...");

  io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket conectado: ${socket.id}`);

    // Teste básico
    socket.on("ping", () => {
      console.log("🏓 Ping recebido de:", socket.id);
      socket.emit("pong", {
        timestamp: Date.now(),
        socketId: socket.id,
        message: "Socket.IO funcionando no Nuxt 4!",
      });
    });

    // Autenticação
    socket.on("authenticate", (userId: string) => {
      socket.data.userId = userId;
      connectedUsers.set(userId, socket.id);
      console.log(`👤 Usuário ${userId} autenticado`);

      socket.emit("authenticated", {
        userId,
        socketId: socket.id,
        success: true,
        timestamp: new Date().toISOString(),
      });
    });

    // Chat - entrar
    socket.on("join-chat", (data: { chatId: string; userId: string }) => {
      const { chatId, userId } = data;
      socket.join(`chat-${chatId}`);
      console.log(`🚀 Usuário ${userId} entrou no chat ${chatId}`);

      // Notificar outros
      socket.to(`chat-${chatId}`).emit("user-joined", { userId, chatId });

      // Confirmar para o usuário
      socket.emit("chat-joined", {
        chatId,
        userId,
        success: true,
        timestamp: new Date().toISOString(),
      });
    });

    // Chat - sair
    socket.on("leave-chat", (data: { chatId: string; userId: string }) => {
      const { chatId, userId } = data;
      socket.leave(`chat-${chatId}`);
      console.log(`👋 Usuário ${userId} saiu do chat ${chatId}`);

      socket.to(`chat-${chatId}`).emit("user-left", { userId, chatId });
    });

    // Mensagens
    socket.on("send-message", (data: { chatId: string; message: any }) => {
      const { chatId, message } = data;
      const timestamp = new Date().toISOString();

      console.log(`💬 Nova mensagem no chat ${chatId}:`, message.text);

      // Enviar para outros no chat
      socket.to(`chat-${chatId}`).emit("new-message", {
        ...message,
        receivedAt: timestamp,
      });

      // Confirmar para o remetente
      socket.emit("message-sent", {
        messageId: message.id,
        sentAt: timestamp,
        success: true,
      });
    });

    // Digitação
    socket.on(
      "typing-start",
      (data: { chatId: string; userId: string; userName: string }) => {
        const { chatId, userId, userName } = data;
        socket.to(`chat-${chatId}`).emit("user-typing", {
          userId,
          userName,
          isTyping: true,
        });
      }
    );

    socket.on("typing-stop", (data: { chatId: string; userId: string }) => {
      const { chatId, userId } = data;
      socket.to(`chat-${chatId}`).emit("user-typing", {
        userId,
        isTyping: false,
      });
    });

    // Status
    socket.on("update-status", (status: "online" | "offline") => {
      const userId = socket.data.userId;
      if (userId) {
        socket.broadcast.emit("user-status-changed", { userId, status });
        console.log(`🔄 Status do usuário ${userId}: ${status}`);
      }
    });

    // Desconexão
    socket.on("disconnect", (reason) => {
      const userId = socket.data.userId;
      if (userId) {
        connectedUsers.delete(userId);
        socket.broadcast.emit("user-status-changed", {
          userId,
          status: "offline",
        });
        console.log(`👤 Usuário ${userId} desconectado`);
      }
      console.log(`❌ Socket desconectado: ${socket.id}, razão: ${reason}`);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`🚨 Erro no socket ${socket.id}:`, error);
    });
  });

  console.log("✅ Socket.IO configurado com sucesso!");
}
