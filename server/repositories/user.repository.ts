// server/repositories/user.repository.ts
import User from "../models/user.model";
import { IUser } from "../types/user.type";
import { Types } from "mongoose";

export class UserRepository {
  // CREATE
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    await user.save();

    const savedUser = await User.findById(user._id).select("-password").lean();
    return savedUser as IUser;
  }

  // READ
  async findById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id).select("-password").lean();
    return user as IUser | null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).select("-password").lean();
    return user as IUser | null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await User.findOne({ username }).select("-password").lean();
    return user as IUser | null;
  }

  async getUsersByIds(ids: string[]): Promise<IUser[]> {
    // Filtrar apenas IDs válidos
    const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return [];
    }

    const users = await User.find({
      _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
    })
      .select("-password")
      .lean();

    return users as IUser[];
  }

  // UPDATE
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

  // FRIENDS
  async addFriend(userId: string, friendId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: new Types.ObjectId(friendId) } },
      { new: true }
    )
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  async removeFriend(userId: string, friendId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: new Types.ObjectId(friendId) } },
      { new: true }
    )
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  // FRIEND REQUESTS
  async addFriendRequest(
    userId: string,
    fromUserId: string
  ): Promise<IUser | null> {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(fromUserId)
    ) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
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

  // SEARCH
  async searchUsers(query: string): Promise<IUser[]> {
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20)
      .lean();

    return users as IUser[];
  }

  // ONLINE USERS
  async getOnlineUsers(): Promise<IUser[]> {
    const users = await User.find({ isOnline: true })
      .select("-password")
      .sort({ lastSeen: -1 })
      .lean();

    return users as IUser[];
  }

  // GET FRIENDS - Agora retorna os dados completos dos amigos
  async getFriends(userId: string): Promise<IUser[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    // Buscar o usuário para pegar os IDs dos amigos
    const user = await User.findById(userId).select("friends").lean();

    if (!user || !user.friends || user.friends.length === 0) {
      return [];
    }

    // Buscar os dados completos dos amigos
    const friendsData = await User.find({
      _id: { $in: user.friends },
    })
      .select("-password")
      .lean();

    return friendsData as IUser[];
  }

  // UPDATE STATUS
  async updateOnlineStatus(
    userId: string,
    isOnline: boolean
  ): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isOnline,
        lastSeen: new Date(),
      },
      { new: true }
    )
      .select("-password")
      .lean();

    return user as IUser | null;
  }

  // MÉTODO UTILITÁRIO - Converte IUser para IUserResponse (para APIs)
  // userToResponse(user: IUser): IUserResponse {
  //   return {
  //     _id: user._id.toString(),
  //     email: user.email,
  //     fullName: user.fullName,
  //     username: user.username,
  //     profileImage: user.profileImage,
  //     friends: user.friends.map((id) => id.toString()),
  //     friendRequests: user.friendRequests.map((req) => ({
  //       from: req.from.toString(),
  //       status: req.status,
  //       createdAt: req.createdAt,
  //       updatedAt: req.updatedAt,
  //     })),
  //     groups: user.groups.map((id) => id.toString()),
  //     isOnline: user.isOnline,
  //     lastSeen: user.lastSeen,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   };
  // }

  // MÉTODO UTILITÁRIO - Converte múltiplos users
  // usersToResponse(users: IUser[]): IUserResponse[] {
  //   return users.map((user) => this.userToResponse(user));
  // }
}

export const userRepository = new UserRepository();
