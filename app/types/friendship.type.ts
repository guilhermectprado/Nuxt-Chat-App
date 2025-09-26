import type { IUser } from "./user.type";

export interface IFriendshipListResponse {
  success: boolean;
  data: IUser[];
  count: number;
}
