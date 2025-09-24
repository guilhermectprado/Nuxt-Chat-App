import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageText: {
      type: String,
      default: "",
    },
    lastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //
    isGroup: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // isPublicGroup: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1, lastMessageTimestamp: -1 });
chatSchema.index({ isGroup: 1, groupRef: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
