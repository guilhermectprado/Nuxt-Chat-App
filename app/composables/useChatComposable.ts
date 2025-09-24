import type { IChat } from "~/types/chat.type";
import { useUserStore } from "~/store/useUserStore";
import type { IMessageSocketResponse } from "~/types/message.type";

export const useChatComposable = () => {
  const userStore = useUserStore();
  const { socket } = useSocketComposable();

  const activeChat = useState<IChat | null>("activeChat", () => null);

  const setActiveChat = (friend: any) => {
    activeChat.value = friend;
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
  };
};
