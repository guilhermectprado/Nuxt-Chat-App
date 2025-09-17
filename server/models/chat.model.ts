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
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    // lastMessage: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Message",
    // },
    // CAMPOS NOVOS PARA OTIMIZAÇÃO: - sugestao DeepSick
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
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1, lastMessageTimestamp: -1 });
chatSchema.index({ isGroup: 1, groupRef: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
