import type { IChat } from "~/types/chat.type";

export const useActiveChat = () => {
  const listChats = useState<any>("listChats", () => null);

  const activeChat = useState<IChat | null>("activeChat", () => null);

  const setActiveChat = (friend: any) => {
    activeChat.value = friend;
  };

  const clearActiveChat = () => {
    activeChat.value = null;
  };

  return {
    listChats,
    activeChat: readonly(activeChat),
    setActiveChat,
    clearActiveChat,
  };
};
