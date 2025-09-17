export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  username: string;
  profileImage?: string;
  groups: string[];
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
