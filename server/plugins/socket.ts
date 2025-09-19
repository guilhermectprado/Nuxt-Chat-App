import { Server as SocketIOServer } from "socket.io";
import type { NitroApp } from "nitropack";

export default async (nitroApp: NitroApp) => {
  // Criar servidor Socket.IO
  const io = new SocketIOServer({
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://your-domain.com"]
          : ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Store de usuários conectados
  const connectedUsers = new Map<string, string>(); // userId -> socketId

  io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // Autenticar usuário
    socket.on("authenticate", (userId: string) => {
      socket.data.userId = userId;
      connectedUsers.set(userId, socket.id);
      console.log(`Usuário ${userId} autenticado`);
    });

    // Entrar em chat
    socket.on(
      "join-chat",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        socket.join(`chat-${chatId}`);
        console.log(`Usuário ${userId} entrou no chat ${chatId}`);

        // Notificar outros no chat
        socket.to(`chat-${chatId}`).emit("user-joined", { userId, chatId });
      }
    );

    // Sair de chat
    socket.on(
      "leave-chat",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        socket.leave(`chat-${chatId}`);
        console.log(`Usuário ${userId} saiu do chat ${chatId}`);

        socket.to(`chat-${chatId}`).emit("user-left", { userId, chatId });
      }
    );

    // Receber mensagem
    socket.on(
      "send-message",
      ({ chatId, message }: { chatId: string; message: any }) => {
        // Enviar para todos no chat, exceto o remetente
        socket.to(`chat-${chatId}`).emit("new-message", {
          ...message,
          receivedAt: new Date().toISOString(),
        });

        console.log(`Mensagem enviada no chat ${chatId}:`, message.text);
      }
    );

    // Indicador de digitação
    socket.on(
      "typing-start",
      ({
        chatId,
        userId,
        userName,
      }: {
        chatId: string;
        userId: string;
        userName: string;
      }) => {
        socket.to(`chat-${chatId}`).emit("user-typing", {
          userId,
          userName,
          isTyping: true,
        });
      }
    );

    socket.on(
      "typing-stop",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        socket.to(`chat-${chatId}`).emit("user-typing", {
          userId,
          isTyping: false,
        });
      }
    );

    // Status online/offline
    socket.on("update-status", (status: "online" | "offline") => {
      const userId = socket.data.userId;
      if (userId) {
        // Broadcast para todos os chats que o usuário participa
        socket.broadcast.emit("user-status-changed", { userId, status });
      }
    });

    // Desconexão
    socket.on("disconnect", (reason) => {
      const userId = socket.data.userId;
      if (userId) {
        connectedUsers.delete(userId);

        // Notificar que o usuário ficou offline
        socket.broadcast.emit("user-status-changed", {
          userId,
          status: "offline",
        });
      }

      console.log(`Socket desconectado: ${socket.id}, razão: ${reason}`);
    });
  });

  // Anexar Socket.IO ao servidor HTTP do Nitro quando ele iniciar
  // nitroApp.hooks.hook("listen", (server: any) => {
  //   io.attach(server);
  //   console.log("Socket.IO anexado ao servidor HTTP do Nitro");
  // });

  // Hook para quando o servidor fechar
  nitroApp.hooks.hook("close", async () => {
    io.close();
    console.log("Socket.IO server fechado");
  });

  console.log("Socket.IO servidor inicializado no Nitro");
};
