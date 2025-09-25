export interface IUser {
  _id: string;
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

export interface IUserStore {
  user: IUser | null;
  isAuthenticated: boolean;
}

export interface IUserPatchResponse {
  success: boolean;
  data: IUser;
  message: string;
}
