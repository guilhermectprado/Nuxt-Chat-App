import { chatRepository } from "~~/server/repositories/chat.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "ID do usuário é obrigatório",
      });
    }

    const body = await readBody(event);
    const { friendId } = body;

    let chat = await chatRepository.findChatBetweenUsers(userId, friendId);
    let isNewChat = false;

    if (!chat) {
      chat = await chatRepository.createChat(userId, friendId);
      isNewChat = true;
    }

    return {
      success: true,
      chat,
      message: isNewChat ? "Chat criado com sucesso" : "Chat já existia",
      isNewChat,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro ao buscar amigos",
    });
  }
});
