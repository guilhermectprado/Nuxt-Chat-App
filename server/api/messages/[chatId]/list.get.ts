import { messageRepository } from "~~/server/repositories/message.repository";

export default defineEventHandler(async (event) => {
  try {
    const chatId = getRouterParam(event, "chatId");

    if (!chatId) {
      throw createError({
        statusCode: 400,
        message: "ID do chat é obrigatório",
      });
    }

    const messagesList = await messageRepository.findMessagesChats(chatId);

    return {
      success: true,
      data: messagesList,
      count: messagesList.length,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro ao enviar mensagem",
    });
  }
});
