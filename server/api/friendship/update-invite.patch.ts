import { getSocketIO } from "~~/server/plugins/socket";
import { friendshipRepository } from "~~/server/repositories/friendship.repository";
import { userRepository } from "~~/server/repositories/user.repository";
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

    if (!["accepted", "reject"].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Status deve ser 'accepted' ou 'reject'.",
      });
    }

    if (userId === fromUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Você não pode responder sua própria solicitação.",
      });
    }

    if (status === "accepted") {
      await friendshipRepository.updateFriendRequestStatus(userId, fromUserId);
    } else {
      await friendshipRepository.deleteFriendRequestStatus(userId, fromUserId);
    }

    const newFriend = await userRepository.findById(fromUserId);

    const message =
      status === "accepted"
        ? "Solicitação de amizade aceita com sucesso!"
        : "Solicitação de amizade rejeitada.";

    const io = getSocketIO();
    if (io) {
      io.to(fromUserId.toString()).emit(
        "new-friend",
        `${newFriend?.fullName} aceitou sua solicitação de amizade.`
      );
    }

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
