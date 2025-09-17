import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // SE GRUPO É UM TIPO DE CHAT, NAO PRECISA DE PARTICIPANTS AQUI
    // participants: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     role: {
    //       type: String,
    //       enum: ["admin", "moderator", "member"],
    //       default: "member",
    //     },
    //     joinedAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    image: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    chatRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  { timestamps: true }
);

groupSchema.index({ isPublic: 1, createdAt: -1 });

const Group = mongoose.model("Group", groupSchema);
export default Group;
