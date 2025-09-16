// serve/model/user.model.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: {
          type: Date,
        },
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ===== INDEXES PARA PERFORMANCE =====
// Status online - buscar usuários online
userSchema.index({ isOnline: 1 });

// Busca de usuários - por nome/username
userSchema.index({ fullName: "text", username: "text" });

// Amigos - buscar amigos de um usuário
userSchema.index({ friends: 1 });

// Pedidos de amizade - buscar pedidos pendentes
userSchema.index({ "friendRequests.from": 1, "friendRequests.status": 1 });

// Composto para buscar usuários online ordenados
userSchema.index({ isOnline: 1, lastSeen: -1 });

// ===== toJSON (remove senha) =====
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
