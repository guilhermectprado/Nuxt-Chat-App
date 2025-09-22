import { getSocket } from "~/plugins/socket.client";

export const useSocketComposable = () => {
  const { $socket } = useNuxtApp();
  const socket = $socket || getSocket();

  return {
    socket,
    isConnected: computed(() => socket?.connected || false),
    socketId: computed(() => socket?.id || null),
  };
};
