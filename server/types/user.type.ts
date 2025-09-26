import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  username: string;
  profileImage: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
