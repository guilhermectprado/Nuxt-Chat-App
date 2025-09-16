// server/api/users/search.get.ts
import { getIdUser } from "~~/server/utils/getIdUser";
import { userRepository } from "../../repositories/user.repository";
import { friendshipRepository } from "~~/server/repositories/friendship.repository";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event).user as string;

    if (!query || query.length < 2) {
      return {
        success: true,
        users: [],
        count: 0,
      };
    }

    const userId = getIdUser(event);

    const searchedUsers = await userRepository.searchUsers(userId, query);
    if (searchedUsers.length === 0) {
      return {
        success: true,
        users: [],
        count: 0,
      };
    }

    const friendships = await friendshipRepository.findUserFriendships(userId);

    const usersWithRelation = searchedUsers.map((user) => {
      const userIdStr = user._id.toString();

      const friendship = friendships.find(
        (f) =>
          f.userOne.toString() === userIdStr ||
          f.userTwo.toString() === userIdStr
      );

      let relation = "none";

      if (friendship) {
        if (friendship.status === "accepted") {
          relation = "friends";
        } else if (friendship.status === "pending") {
          relation =
            friendship.initiator.toString() === userId
              ? "pending_sent"
              : "pending_received";
        }
      }

      return {
        _id: userIdStr,
        fullName: user.fullName,
        username: user.username,
        profileImage: user.profileImage || "",
        relation,
      };
    });

    return {
      success: true,
      users: usersWithRelation,
      count: usersWithRelation.length,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro na busca de usuários",
    });
  }
});
