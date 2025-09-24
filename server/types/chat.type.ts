import { Types, Document } from "mongoose";
import { IUser } from "./user.type";

export interface IChat extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];

  lastMessageText: string;
  lastMessageTimestamp: Date;
  lastMessageSender: Types.ObjectId;

  isGroup: boolean;
  name: string;
  description: string;
  image: string;
  admin: Types.ObjectId;
  // isPublicGroup: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// Interface para chat populado (usado no retorno de findUserChats)
// Omite participants, groupfRef e lastMessageSander padrão do IChat e
// manda o objeto por completo
export interface IChatPopulated
  extends Omit<IChat, "participants" | "lastMessageSender"> {
  participants: IUser[];
  lastMessageSender?: IUser;
}
