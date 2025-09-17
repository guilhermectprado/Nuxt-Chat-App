export const useActiveChat = () => {
  const activeChat = useState<any>("activeChat", () => null);

  const setActiveChat = (friend: any) => {
    activeChat.value = friend;
  };

  const clearActiveChat = () => {
    activeChat.value = null;
  };

  return {
    activeChat: readonly(activeChat),
    setActiveChat,
    clearActiveChat,
  };
};
