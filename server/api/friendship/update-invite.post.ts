// // server/api/user/friends/update-invite.post.ts
// import jwt from "jsonwebtoken";
// import { friendRepository } from "~~/server/repositories/friendship.repository";
// import { getIdUser } from "~~/server/utils/getIdUser";

// const config = useRuntimeConfig();

// export default defineEventHandler(async (event) => {
//   try {
//     const userId = getIdUser(event);

//     const body = await readBody(event);
//     const { fromUserId, status } = body;

//     if (!userId || !fromUserId) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: "Identificação de usuário falhou.",
//       });
//     }

//     await friendRepository.updateFriendRequestStatus(
//       userId,
//       fromUserId,
//       status
//     );

//     if (status === "accepted") {
//       await friendRepository.addFriend(userId, fromUserId);
//       await friendRepository.addFriend(fromUserId, userId);
//     }

//     return {
//       success: true,
//       message: "Solicitação de amizade aceita.",
//     };
//   } catch (error: any) {
//     if (error.statusCode && error.statusCode !== 500) {
//       throw error;
//     }

//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.message || "Erro interno do servidor",
//     });
//   }
// });
