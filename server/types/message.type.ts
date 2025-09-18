import { Types } from "mongoose";
import { IUser } from "./user.type";

export interface IMessage {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  image: string;
  // readBy: Array<{
  //   userId: Types.ObjectId;
  //   readAt: Date;
  // }>;
  repliedTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessagePopulated
  extends Omit<IMessage, "senderId" | "repliedTo"> {
  senderId: IUser;
  repliedTo?: {
    _id: Types.ObjectId;
    text?: string;
    image?: string;
    sender: {
      _id: Types.ObjectId;
      name: string;
      profileImage?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };
}
