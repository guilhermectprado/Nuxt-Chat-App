import { chatRepository } from "~~/server/repositories/chat.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

interface IGroupBody {
  name: string;
  participants: string[];
  image: string;
}

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "ID do usuário é obrigatório",
      });
    }

    const { participants, ...body }: IGroupBody = await readBody(event);

    const aux = {
      participants: [...participants, userId],
      isGroup: true,
      ...body,
      admin: userId,
    };

    const group = await chatRepository.createChat(aux);

    return {
      success: true,
      group,
      message: "Grupo criado com sucesso",
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
