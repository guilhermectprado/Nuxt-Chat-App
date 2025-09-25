import type { IChat } from "~/types/chat.type";
import { useUserStore } from "~/store/useUserStore";

export const useChatComposable = () => {
  const userStore = useUserStore();
  const { socket } = useSocketComposable();

  const activeChat = useState<IChat | null>("activeChat", () => null);

  const setActiveChat = (chat: any) => {
    activeChat.value = chat;

    if (chat?._id) {
      // unreadMessages.value.delete(chat._id);
      markChatAsRead(chat._id);
    }
  };

  const clearActiveChat = () => {
    activeChat.value = null;
  };

  const joinUserChats = async (userChats: string[]) => {
    if (!socket) return;

    userChats.forEach((chat) => {
      socket.emit("join-chat", {
        chatId: chat,
        userId: userStore.getUserId,
      });
    });
  };

  // const unreadMessages = useState<Map<string, number>>(
  //   "unreadMessages",
  //   () => new Map()
  // );

  // const addUnreadMessage = (chatId: string) => {
  //   if (chatId !== activeChat.value?._id) {
  //     const current = unreadMessages.value.get(chatId) || 0;
  //     unreadMessages.value.set(chatId, current + 1);
  //   }
  // };

  // const getUnreadCount = (chatId: string): number => {
  //   return unreadMessages.value.get(chatId) || 0;
  // };

  const markChatAsRead = async (chatId: string) => {
    try {
      await $fetch(`/api/chats/${chatId}/mark-read`, { method: "PUT" });
    } catch (error) {
      console.error("Erro ao marcar chat como lido:", error);
    }
  };

  ////////////////////////////////////////////////

  // const joinSpecificChat = (chatId: string) => {
  //   if (socket) {
  //     socket.emit("join-chat", {
  //       chatId,
  //       userId: userStore.getUserId,
  //     });
  //   }
  // };

  // const leaveChat = (chatId: string) => {
  //   if (socket) {
  //     socket.emit('leave-chat', { chatId })
  //   }
  // }

  // QUANDO MANDA MENSAGEM, ELE ATUALIZA O LASTMESSAGETEXT DO CHAT NA LISTAGEM
  // E SOBE PARA CONVERSAS MAIS RECENTES

  return {
    activeChat: readonly(activeChat),
    setActiveChat,
    clearActiveChat,
    joinUserChats,
    // addUnreadMessage,
    // getUnreadCount,
  };
};
