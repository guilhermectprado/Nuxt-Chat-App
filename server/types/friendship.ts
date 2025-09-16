import { Types } from "mongoose";

export interface IFriendship {
  userOne: Types.ObjectId;
  userTwo: Types.ObjectId;
  initiator: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
