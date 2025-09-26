import { getSocketIO } from "~~/server/plugins/socket";
import { chatRepository } from "~~/server/repositories/chat.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);
    const chatId = getRouterParam(event, "chatId");

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Usuário não autenticado",
      });
    }

    if (!chatId) {
      throw createError({
        statusCode: 400,
        message: "ID do chat é obrigatório",
      });
    }

    await chatRepository.markChatAsRead(chatId, userId);

    const chat = await chatRepository.findChatById(chatId);

    const io = getSocketIO();

    if (io && chat) {
      chat.participants.forEach((participant) => {
        console.log(participant._id.toString());

        io.to(participant._id.toString()).emit("update-chat", {
          ...chat,
        });
      });
    }

    return {
      success: true,
      message: "Chat marcado como lido.",
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
