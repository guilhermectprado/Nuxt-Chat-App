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

    const chats = await chatRepository.findUserChats(userId);

    return {
      success: true,
      data: chats,
      count: chats.length,
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
