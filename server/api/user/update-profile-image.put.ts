// export const updateProfileImage = async (req, res) => {
//   try {
//     const { profileImage } = req.body;
//     const userId = req.user._id;

//     if (!profileImage) {
//       return res.status(400).json({ message: "Foto de Perfil é obrigatório" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profileImage);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profileImage: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log(
//       "Erro na Controladora de Usuário (updateProfileImage)",
//       error.message
//     );
//     res.status(500).json({ message: "Erro Interno do Servidor" });
//   }
// };
