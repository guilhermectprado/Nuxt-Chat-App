import { Types } from "mongoose";

export interface IFriendship {
  userOne: Types.ObjectId;
  userTwo: Types.ObjectId;
  initiator: Types.ObjectId;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}
