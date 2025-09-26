import cloudinary from "~~/server/lib/cloudinary";
import { getSocketIO } from "~~/server/plugins/socket";
import { chatRepository } from "~~/server/repositories/chat.repository";
import { messageRepository } from "~~/server/repositories/message.repository";
import { IMessagePopulated } from "~~/server/types/message.type";
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

    const body = await readBody(event);
    const { text, image, repliedTo } = body;

    if (!text && !image) {
      throw createError({
        statusCode: 400,
        message: "Mensagem vazia.",
      });
    }

    if (repliedTo) {
      try {
        await messageRepository.getMessageById(repliedTo);
      } catch {
        throw createError({
          statusCode: 404,
          message: "Mensagem a ser respondida não encontrada",
        });
      }
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const createdMessage = await messageRepository.createMessage({
      chatId,
      userId,
      text,
      imageUrl,
      repliedTo,
    });

    await chatRepository.updateLastMessageChat(chatId, {
      lastMessageText: text || "📷 Imagem",
      lastMessageSender: userId,
      lastMessageTimestamp: new Date(),
    });

    await chatRepository.incrementUnreadForOthers(chatId, userId);

    const chat = await chatRepository.findChatById(chatId);

    const io = getSocketIO();
    if (io && chat) {
      chat.participants.forEach((participant) => {
        io.to(participant._id.toString()).emit("new-message", {
          ...createdMessage,
        });

        io.to(participant._id.toString()).emit("update-chat", {
          ...chat,
        });
      });
    }

    return {
      success: true,
      data: createdMessage as IMessagePopulated,
      message: "Mensagem enviada com sucesso.",
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
