import User from "../models/user.model";
import { IUser } from "../types/user.type";
import { Types } from "mongoose";
import { friendshipRepository } from "./friendship.repository";

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    await user.save();

    const savedUser = await User.findById(user._id).select("-password").lean();
    return savedUser as IUser;
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id).select("-password").lean();
    return user as IUser | null;
  }

  async findByEmail(
    email: string,
    withPassword: boolean = false
  ): Promise<IUser | null> {
    let user;

    if (withPassword) {
      user = await User.findOne({ email }).lean();
    } else {
      user = await User.findOne({ email }).select("-password").lean();
    }

    return user as IUser | null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await User.findOne({ username }).select("-password").lean();
    return user as IUser | null;
  }

  async searchUsers(userId: string, query: string): Promise<IUser[]> {
    const users = await User.find({
      _id: { $ne: new Types.ObjectId(userId) },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      // .limit(20)
      .lean();

    return users as IUser[];
  }

  // async getOnlineUsers(): Promise<IUser[]> {
  //   const users = await User.find({ isOnline: true })
  //     .select("-password")
  //     .sort({ lastSeen: -1 })
  //     .lean();

  //   return users as IUser[];
  // }

  // UPDATE STATUS
  // async updateOnlineStatus(
  //   userId: string,
  //   isOnline: boolean
  // ): Promise<IUser | null> {
  //   if (!Types.ObjectId.isValid(userId)) {
  //     return null;
  //   }

  //   const user = await User.findByIdAndUpdate(
  //     userId,
  //     {
  //       isOnline,
  //       lastSeen: new Date(),
  //     },
  //     { new: true }
  //   )
  //     .select("-password")
  //     .lean();

  //   return user as IUser | null;
  // }
}

export const userRepository = new UserRepository();
