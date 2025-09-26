import type { IChat } from "~/types/chat.type";

export const useChatComposable = () => {
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

  const markChatAsRead = async (chatId: string) => {
    try {
      await $fetch(`/api/chats/${chatId}/mark-read`, { method: "PATCH" });
    } catch (error) {
      console.error("Erro ao marcar chat como lido:", error);
    }
  };

  // const logout = (chatId: string) => {
  //   if (socket) {
  //     socket.emit('disconnect', { chatId })
  //   }
  // }

  return {
    activeChat: readonly(activeChat),
    setActiveChat,
    markChatAsRead,
    clearActiveChat,
    // joinUserChats,
  };
};
