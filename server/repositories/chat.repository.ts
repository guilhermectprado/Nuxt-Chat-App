import Chat from "../models/chat.model";
import { IChat, IChatPopulated } from "../types/chat.type";
import { IGroup } from "../types/group.type";
import { IUser } from "../types/user.type";

export class ChatRepository {
  async createChat(userId: string, friendId: string): Promise<IChat> {
    const chatData = {
      participants: [userId, friendId],
      isGroup: false,
    };

    const chat = new Chat(chatData);
    await chat.save();

    const savedChat = await Chat.findById(chat._id).lean<IChat>();

    if (!savedChat) {
      throw new Error("Erro ao criar chat");
    }

    return savedChat as IChat;
  }

  async findUserChats(userId: string): Promise<IChatPopulated[]> {
    const chats = await Chat.find({
      participants: userId,
    })
      // Transforma: IDs de participantes → objetos de usuário completos
      .populate<{ participants: IUser[] }>({
        path: "participants",
        match: { _id: { $ne: userId } }, // Exclui o próprio usuário
        select: "fullName username profileImage isOnline",
      })
      // Transforma: ID do grupo → objeto grupo completo
      .populate<{ groupRef: IGroup }>({
        path: "groupRef",
        select: "name image",
      })
      // Transforma: ID do remetente → objeto usuário
      .populate<{ lastMessageSender: IUser }>({
        path: "lastMessageSender",
        select: "fullName",
      })
      .sort({ lastMessageTimestamp: -1 })
      .lean<IChatPopulated[]>()
      .exec();

    return chats;
  }

  // Para validar existencia de chats privados entre dois usuários
  async findChatBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<IChat | null> {
    const chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
      isGroup: false,
    })
      .populate<{ participants: IUser[] }>({
        path: "participants",
        match: { _id: { $ne: userId1 } },
        select: "fullName username profileImage isOnline",
      })
      .lean<IChat>();

    return chat;
  }

  async findChatById(chatId: string): Promise<IChatPopulated | null> {
    const chat = await Chat.findById(chatId)
      .populate<{ participants: IUser[] }>({
        path: "participants",
        select: "fullName username profileImage isOnline",
      })
      .populate<{ groupRef: IGroup }>({
        path: "groupRef",
        select: "name image",
      })
      .populate<{ lastMessageSender: IUser }>({
        path: "lastMessageSender",
        select: "fullName",
      })
      .lean<IChatPopulated>()
      .exec();

    return chat;
  }

  async updateLastMessageChat(chatId: string, data: any) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: data,
      },
      { new: true, lean: true }
    );

    return updatedChat;
  }
}

export const chatRepository = new ChatRepository();
