import Message from "../models/message.model";
import { IMessagePopulated } from "../types/message.type";

interface CreateMessageParams {
  chatId: string;
  userId: string;
  text?: string;
  imageUrl?: string;
  repliedTo?: string;
}

export class MessageRepository {
  async createMessage(params: CreateMessageParams): Promise<IMessagePopulated> {
    const { chatId, userId, text = "", imageUrl = "", repliedTo } = params;

    const messageData: any = {
      chatId,
      senderId: userId,
      text,
      image: imageUrl,
    };

    if (repliedTo) {
      messageData.repliedTo = repliedTo;
    }

    const message = new Message(messageData);
    await message.save();

    const savedMessages = await this.getMessageById(message.id);

    return savedMessages as IMessagePopulated;
  }

  async getMessageById(messageId: string): Promise<IMessagePopulated> {
    const message = await Message.findById(messageId)
      .populate({
        path: "senderId",
        select: "fullName profileImage",
      })
      .populate({
        path: "repliedTo",
        select: "text image createdAt updatedAt",
        populate: {
          path: "senderId",
          select: "fullName profileImage",
        },
      })
      .lean()
      .exec();

    if (!message) {
      throw new Error("Mensagem não encontrada");
    }

    const { senderId, repliedTo, ...rest } = message;

    const transformedMessage: any = {
      ...rest,
      sender: senderId,
    };

    const repliedToPopulated = repliedTo as any;
    if (repliedToPopulated && typeof repliedToPopulated === "object") {
      transformedMessage.repliedTo = {
        _id: repliedToPopulated._id,
        text: repliedToPopulated.text,
        image: repliedToPopulated.image,
        createdAt: repliedToPopulated.createdAt,
        updatedAt: repliedToPopulated.updatedAt,
        sender: repliedToPopulated.senderId,
      };
    }

    return transformedMessage as IMessagePopulated;
  }

  async findMessagesChats(chatId: string): Promise<IMessagePopulated[]> {
    const messages = await Message.find({
      chatId: chatId,
    })
      .populate({
        path: "senderId",
        select: "fullName profileImage",
      })
      .populate({
        path: "repliedTo",
        select: "text image createdAt updatedAt",
        populate: {
          path: "senderId",
          select: "fullName profileImage",
        },
      })
      .lean()
      .exec();

    const formatedResult = messages.map((message) => {
      const { senderId, repliedTo, ...rest } = message;

      const transformedMessage: any = {
        ...rest,
        sender: senderId,
      };

      const repliedToPopulated = repliedTo as any;

      if (repliedToPopulated && typeof repliedToPopulated === "object") {
        transformedMessage.repliedTo = {
          _id: repliedToPopulated._id,
          text: repliedToPopulated.text,
          image: repliedToPopulated.image,
          createdAt: repliedToPopulated.createdAt,
          updatedAt: repliedToPopulated.updatedAt,
          sender: repliedToPopulated.senderId,
        };
      }

      return transformedMessage;
    });

    return formatedResult as IMessagePopulated[];
  }
}

export const messageRepository = new MessageRepository();
