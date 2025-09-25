import cloudinary from "~~/server/lib/cloudinary";
import { userRepository } from "~~/server/repositories/user.repository";
import { IUser } from "~~/server/types/user.type";

export default defineEventHandler(async (event) => {
  const userId = getIdUser(event);
  const body = await readBody(event);
  const { image, ...updatedData } = body;

  try {
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: "IDs de usuário obrigatórios. ",
      });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);

      if (!uploadResponse) {
        throw createError({
          statusCode: 400,
          statusMessage: "Erro ao fazer upload da foto de perfil. ",
        });
      }

      imageUrl = uploadResponse.secure_url;
    }

    const aux = { ...updatedData, imageUrl };

    const updatedUser = await userRepository.updateUser(userId, aux);

    return {
      success: true,
      data: updatedUser as IUser,
      message: "Dados atualizados.",
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro ao atualizar informações do usuário.",
    });
  }
});
