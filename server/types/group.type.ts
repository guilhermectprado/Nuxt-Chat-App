import { Types } from "mongoose";

export interface IGroup {
  _id: Types.ObjectId;
  name: string;
  description: string;
  image?: string;
  isPublic: boolean;
  admin: Types.ObjectId;
  chatRef: Types.ObjectId;
}
