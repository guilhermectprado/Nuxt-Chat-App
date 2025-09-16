import Friendship from "../models/friendship";
import { IFriendship } from "../types/friendship";
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
}

export const friendshipRepository = new FriendshipRepository();
