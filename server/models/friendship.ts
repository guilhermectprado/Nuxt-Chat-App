import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  userOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: {
    type: Date,
  },
});

// Índice para evitar duplicatas
friendshipSchema.index({ userOne: 1, userTwo: 1 }, { unique: true });

const Friendship = mongoose.model("Friendship", friendshipSchema);
export default Friendship;
