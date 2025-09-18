export const useActiveChat = () => {
  const listChats = useState<any>("listChats", () => null);

  const activeChat = useState<any>("activeChat", () => null);

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
