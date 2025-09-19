import type { Socket } from "socket.io-client";

export const useSocket = () => {
  const { $socket } = useNuxtApp();
  const socket = $socket as Socket | null;

  if (!socket) {
    return {
      socket: null,
      authenticate: () => {},
      joinChat: () => {},
      leaveChat: () => {},
      sendMessage: () => {},
      onNewMessage: () => {},
      offNewMessage: () => {},
      startTyping: () => {},
      stopTyping: () => {},
      onUserTyping: () => {},
      onUserStatus: () => {},
      isConnected: ref(false),
    };
  }

  const authenticate = (userId: string) => {
    socket.emit("authenticate", userId);
  };

  const joinChat = (chatId: string, userId: string) => {
    socket.emit("join-chat", { chatId, userId });
  };

  const leaveChat = (chatId: string, userId: string) => {
    socket.emit("leave-chat", { chatId, userId });
  };

  const sendMessage = (chatId: string, message: any) => {
    socket.emit("send-message", { chatId, message });
  };

  const onNewMessage = (callback: (message: any) => void) => {
    socket.on("new-message", callback);
  };

  const offNewMessage = (callback?: (message: any) => void) => {
    socket.off("new-message", callback);
  };

  const startTyping = (chatId: string, userId: string, userName: string) => {
    socket.emit("typing-start", { chatId, userId, userName });
  };

  const stopTyping = (chatId: string, userId: string) => {
    socket.emit("typing-stop", { chatId, userId });
  };

  const onUserTyping = (
    callback: (data: {
      userId: string;
      userName?: string;
      isTyping: boolean;
    }) => void
  ) => {
    socket.on("user-typing", callback);
  };

  const onUserStatus = (
    callback: (data: { userId: string; status: "online" | "offline" }) => void
  ) => {
    socket.on("user-status-changed", callback);
  };

  return {
    socket,
    authenticate,
    joinChat,
    leaveChat,
    sendMessage,
    onNewMessage,
    offNewMessage,
    startTyping,
    stopTyping,
    onUserTyping,
    onUserStatus,
    isConnected: computed(() => socket?.connected || false),
  };
};
