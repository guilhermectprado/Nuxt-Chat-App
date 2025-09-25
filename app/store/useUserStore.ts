import { defineStore } from "pinia";
import type { IUser, IUserStore } from "~/types/user.type";

export const useUserStore = defineStore("user", {
  state: (): IUserStore => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    getUserId: (state) => {
      return state.user?._id || "";
    },
  },

  actions: {
    setUser(user: IUser) {
      this.user = user;
      this.isAuthenticated = true;
    },

    updateUser(user: IUser) {
      this.user = user;
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
