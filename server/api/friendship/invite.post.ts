import { friendshipRepository } from "~~/server/repositories/friendship.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

export default defineEventHandler(async (event) => {
  try {
    const fromUserId = getIdUser(event);

    const body = await readBody(event);
    const { toUserId } = body;

    if (fromUserId === toUserId) {
      throw createError({
        statusCode: 400,
        message: "Você não pode adicionar a si mesmo.",
      });
    }

    const existingFriendship = await friendshipRepository.findFriendship(
      fromUserId,
      toUserId
    );

    if (existingFriendship) {
      throw createError({
        statusCode: 400,
        message: "Solicitação já existe.",
      });
    }

    await friendshipRepository.createFriendship(fromUserId, toUserId);

    return {
      success: true,
      message: "Solicitação enviada com sucesso.",
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro interno do servidor",
    });
  }
});
