import { friendshipRepository } from "~~/server/repositories/friendship.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);
    const body = await readBody(event);
    const { fromUserId, status } = body;

    if (!userId || !fromUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: "IDs de usuário obrigatórios. ",
      });
    }

    if (!["accepted", "none"].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Status deve ser 'accepted' ou 'none'.",
      });
    }

    if (userId === fromUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Você não pode responder sua própria solicitação.",
      });
    }

    const updatedFriendship =
      await friendshipRepository.updateFriendRequestStatus(
        userId,
        fromUserId,
        status
      );

    if (!updatedFriendship) {
      throw createError({
        statusCode: 404,
        statusMessage:
          "Solicitação de amizade não encontrada ou já foi respondida.",
      });
    }

    const message =
      status === "accepted"
        ? "Solicitação de amizade aceita com sucesso!"
        : "Solicitação de amizade rejeitada.";

    return {
      success: true,
      message,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Erro interno do servidor",
    });
  }
});
