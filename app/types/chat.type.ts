import type { IUser } from "./user.type";
interface IGroup {
  _id: string;
  name: string;
  description: string;
  image?: string;
  isPublic: boolean;
  admin: IUser;
  chatRef: string;
}

export interface IChat {
  _id: string;
  participants: IUser[];
  isGroup: boolean;
  groupRef: IGroup;
  lastMessageText: string;
  lastMessageTimestamp: Date;
  lastMessageSender: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatListResponse {
  success: boolean;
  chats: IChat[];
  count: number;
}

export interface IChatSingleResponse {
  success: boolean;
  chat: IChat;
  message: string;
}
