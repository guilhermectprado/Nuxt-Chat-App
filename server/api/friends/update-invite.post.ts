// server/api/user/friends/update-invite.post.ts
import jwt from "jsonwebtoken";
import { friendRepository } from "~~/server/repositories/friend.repository";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "jwt");
    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Token não encontrado",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const body = await readBody(event);
    const { fromUserId, status } = body;

    if (!userId || !fromUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Identificação de usuário falhou.",
      });
    }

    await friendRepository.updateFriendRequestStatus(
      userId,
      fromUserId,
      status
    );

    if (status === "accepted") {
      await friendRepository.addFriend(userId, fromUserId);
      await friendRepository.addFriend(fromUserId, userId);
    }

    return {
      success: true,
      message: "Solicitação de amizade aceita.",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Erro interno do servidor",
    });
  }
});
