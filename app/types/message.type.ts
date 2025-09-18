import type { IUser } from "./user.type";

export interface IMessage {
  _id: string;
  chatId: string;
  sender: IUser;
  text: string;
  image: string;
  repliedTo?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageResponse {
  success: boolean;
  data: IMessage;
  message: string;
}
