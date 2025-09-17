import type { IUser } from "./user.type";

export interface IFriendshipListResponse {
  success: boolean;
  friends: IUser[];
  count: number;
}
