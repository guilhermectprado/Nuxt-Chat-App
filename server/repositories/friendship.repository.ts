import Friendship from "../models/friendship";
import { IFriendship } from "../types/friendship.type";
import { Types } from "mongoose";

export class FriendshipRepository {
  async createFriendship(
    fromUserId: string,
    toUserId: string
  ): Promise<IFriendship> {
    const [userOne, userTwo] = [fromUserId, toUserId].sort();

    const friendshipData = {
      userOne: new Types.ObjectId(userOne),
      userTwo: new Types.ObjectId(userTwo),
      initiator: new Types.ObjectId(fromUserId),
    };

    const friendship = new Friendship(friendshipData);
    await friendship.save();

    const savedFriendship = await Friendship.findById(friendship._id).lean();

    if (!savedFriendship) {
      throw new Error("Erro ao criar amizade");
    }

    return savedFriendship as IFriendship;
  }

  async findFriendship(
    userId1: string,
    userId2: string
  ): Promise<IFriendship | null> {
    const [userOne, userTwo] = [userId1, userId2].sort();

    const friendship = await Friendship.findOne({
      userOne: new Types.ObjectId(userOne),
      userTwo: new Types.ObjectId(userTwo),
    }).lean();

    return friendship as IFriendship | null;
  }

  async findUserFriendships(userId: string): Promise<IFriendship[]> {
    const friendships = await Friendship.find({
      $or: [
        { userOne: new Types.ObjectId(userId) },
        { userTwo: new Types.ObjectId(userId) },
      ],
    }).lean();

    return friendships as IFriendship[];
  }

  async updateFriendRequestStatus(
    currentUserId: string,
    initiatorId: string,
    status: "accepted" | "none"
  ): Promise<IFriendship | null> {
    const [userOne, userTwo] = [currentUserId, initiatorId].sort();

    const friendship = await Friendship.findOneAndUpdate(
      {
        userOne: new Types.ObjectId(userOne),
        userTwo: new Types.ObjectId(userTwo),
        initiator: new Types.ObjectId(initiatorId), // Garante que só o destinatário pode aceitar/rejeitar
        status: "pending", // Só pode alterar se estiver pendente
      },
      {
        status,
        updatedAt: new Date(),
      },
      {
        new: true,
        lean: true,
      }
    );

    return friendship as IFriendship | null;
  }

  async getPendingFriendRequests(userId: string): Promise<IFriendship[]> {
    const requests = await Friendship.find({
      $or: [
        { userOne: new Types.ObjectId(userId) },
        { userTwo: new Types.ObjectId(userId) },
      ],
      initiator: { $ne: new Types.ObjectId(userId) },
      status: "pending",
    })
      .populate("initiator", "name email avatar")
      .lean();

    return requests as IFriendship[];
  }
}

export const friendshipRepository = new FriendshipRepository();
