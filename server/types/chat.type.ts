import { Types, Document } from "mongoose";
import { IUser } from "./user.type";
import { IGroup } from "./group.type";

export interface IChat extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  isGroup: boolean;
  groupRef: Types.ObjectId;
  lastMessageText: string;
  lastMessageTimestamp: Date;
  lastMessageSender: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para chat populado (usado no retorno de findUserChats)
// Omite participants, groupfRef e lastMessageSander padrão do IChat e
// manda o objeto por completo
export interface IChatPopulated
  extends Omit<IChat, "participants" | "groupRef" | "lastMessageSender"> {
  participants: IUser[];
  groupRef?: IGroup;
  lastMessageSender?: IUser;
}
