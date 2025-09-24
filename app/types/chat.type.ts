import type { IUser } from "./user.type";

export interface IChat {
  _id: string;
  participants: IUser[];
  lastMessageText: string;
  lastMessageTimestamp: Date;
  lastMessageSender: IUser;

  isGroup: boolean;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
  admin: string;

  createdAt: String;
  updatedAt: String;
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
