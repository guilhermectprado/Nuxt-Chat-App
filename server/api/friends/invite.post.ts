// server/api/user/friends/invite.post.ts
import jwt from "jsonwebtoken";
import { friendRepository } from "~~/server/repositories/friend.repository";
import { userRepository } from "~~/server/repositories/user.repository";

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
    const fromUserId = decoded.userId;

    const body = await readBody(event);
    const { toUserId } = body;

    if (fromUserId === toUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Você não pode adicionar a si mesmo.",
      });
    }

    const [fromUser, toUser] = await Promise.all([
      userRepository.findById(fromUserId),
      userRepository.findById(toUserId),
    ]);

    if (!toUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "Usuário não encontrado.",
      });
    }

    if (!fromUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "Usuário logado não encontrado.",
      });
    }

    // if (
    //   fromUser?.friends.some((friendId) => friendId.toString() === toUserId)
    // ) {
    //   return { success: false, message: "Vocês já são amigos." };
    // }

    if (fromUser.friends.includes(toUserId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Vocês já são amigos",
      });
    }

    const existingRequest = toUser.friendRequests.find(
      (req) => req.from.toString() === fromUserId && req.status === "pending"
    );

    if (existingRequest) {
      throw createError({
        statusCode: 400,
        statusMessage: "Solicitação já enviada",
      });
    }

    const updatedUser = await friendRepository.addFriendRequest(
      fromUserId,
      toUserId
    );

    if (!updatedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao enviar solicitação",
      });
    }

    // Emitir evento socket para o usuário alvo (se estiver online)
    // const io = (global as any).io;
    // if (io) {
    //   io.to(targetUserId).emit("friend-request-received", {
    //     from: {
    //       _id: currentUser?._id,
    //       username: currentUser?.username,
    //       fullName: currentUser?.fullName,
    //       profileImage: currentUser?.profileImage,
    //     },
    //     createdAt: new Date(),
    //   });
    // }

    return {
      success: true,
      message: "Solicitação enviada com sucesso",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Erro interno do servidor",
    });
  }
});
