// server/api/users/friends.get.ts
import { friendshipRepository } from "~~/server/repositories/friendship.repository";
import { userRepository } from "~~/server/repositories/user.repository";
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

    const friendships = await friendshipRepository.findUserFriendships(userId);
    const acceptedFriendships = friendships.filter(
      (f) => f.status === "accepted"
    );

    const friendIds = acceptedFriendships.map((friendship) => {
      return friendship.userOne.toString() === userId
        ? friendship.userTwo.toString()
        : friendship.userOne.toString();
    });

    const friends = await Promise.all(
      friendIds.map((id) => userRepository.findById(id))
    );

    const validFriends = friends.filter((friend) => friend !== null);

    return {
      success: true,
      friends: validFriends,
      count: validFriends.length,
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
