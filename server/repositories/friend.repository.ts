import User from "../models/user.model";
import { IUser } from "../types/user.type";
import { Types } from "mongoose";

export class FriendRepository {
  async addFriendRequest(
    fromUserId: string,
    toUserId: string
  ): Promise<IUser | null> {
    if (
      !Types.ObjectId.isValid(fromUserId) ||
      !Types.ObjectId.isValid(toUserId)
    ) {
      return null;
    }

    if (fromUserId === toUserId) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      toUserId,
      {
        $addToSet: {
          friendRequests: {
            from: new Types.ObjectId(fromUserId),
            status: "pending",
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  async updateFriendRequestStatus(
    userId: string,
    fromUserId: string,
    status: "accepted" | "rejected"
  ): Promise<IUser | null> {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(fromUserId)
    ) {
      return null;
    }

    const user = await User.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
        "friendRequests.from": new Types.ObjectId(fromUserId),
      },
      {
        $set: {
          "friendRequests.$.status": status,
          "friendRequests.$.updatedAt": new Date(),
        },
      },
      { new: true }
    )
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  async addFriend(userId: string, friendId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: new Types.ObjectId(friendId) } },
      { new: true }
    );

    return user as IUser | null;
  }

  async getFriends(userId: string): Promise<IUser[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    const user = await User.findById(userId).select("friends").lean();

    if (!user || !user.friends || user.friends.length === 0) {
      return [];
    }

    const friendsData = await User.find({
      _id: { $in: user.friends },
    })
      .select("-password")
      .lean();

    return friendsData as IUser[];
  }

  // async removeFriend(userId: string, friendId: string): Promise<IUser | null> {
  //   if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
  //     return null;
  //   }

  //   const user = await User.findByIdAndUpdate(
  //     userId,
  //     { $pull: { friends: new Types.ObjectId(friendId) } },
  //     { new: true }
  //   )
  //     .select("-password")
  //     .lean();

  //   return user as IUser | null;
  // }
}

export const friendRepository = new FriendRepository();
