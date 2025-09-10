// types/user.ts
import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  username: string;
  profileImage?: string;
  friends: Types.ObjectId[];
  friendRequests: IFriendRequest[];
  groups: Types.ObjectId[];
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFriendRequest {
  from: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt?: Date;
}
