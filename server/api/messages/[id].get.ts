// export const getMessagesByUserId = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log(
//       "Erro na Controladora Message (getMessagesByIdUser)",
//       error.message
//     );
//     res.status(500).json({ message: "Erro Interno do Servidor" });
//   }
// };
