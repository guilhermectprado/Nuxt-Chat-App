import type { IChat } from "~/types/chat.type";
import { useUserStore } from "~/store/useUserStore";

export const useChatComposable = () => {
  const userStore = useUserStore();
  const { socket } = useSocketComposable();

  const activeChat = useState<IChat | null>("activeChat", () => null);

  const setActiveChat = (chat: any) => {
    activeChat.value = chat;

    if (chat?._id) {
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

  const markChatAsRead = async (chatId: string) => {
    try {
      await $fetch(`/api/chats/${chatId}/mark-read`, { method: "PATCH" });
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

  return {
    activeChat: readonly(activeChat),
    setActiveChat,
    clearActiveChat,
    joinUserChats,
  };
};
