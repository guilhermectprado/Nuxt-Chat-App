import type { IChat } from "~/types/chat.type";
import { useUserStore } from "~/store/useUserStore";
import type { IMessageSocketResponse } from "~/types/message.type";

export const useChatComposable = () => {
  const userStore = useUserStore();
  const { socket } = useSocketComposable();

  const activeChat = useState<IChat | null>("activeChat", () => null);
  const unreadMessages = useState<
    Map<string, { count: number; lastMessage: any }>
  >("unreadMessages", () => new Map());

  const setActiveChat = (friend: any) => {
    activeChat.value = friend;

    if (friend?._id && unreadMessages.value.has(friend._id)) {
      unreadMessages.value.delete(friend._id);
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

  const addUnreadMessage = async (message: IMessageSocketResponse) => {
    const current = unreadMessages.value.get(message.chatId);
    const newCount = current ? current.count + 1 : 1;

    unreadMessages.value.set(message.chatId, {
      count: newCount,
      lastMessage: message,
    });
  };

  const hasUnreadMessages = (chatId: string): boolean => {
    return getUnreadCount(chatId) > 0;
  };

  const getUnreadCount = (chatId: string): number => {
    return unreadMessages.value.get(chatId)?.count || 0;
  };

  const getTotalUnreadCount = (): number => {
    let total = 0;
    unreadMessages.value.forEach((chat) => {
      total += chat.count;
    });
    return total;
  };

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
    addUnreadMessage,
    hasUnreadMessages,
    getUnreadCount,
    getTotalUnreadCount,
  };
};
