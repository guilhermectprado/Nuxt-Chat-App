import { defineStore } from "pinia";
// import type { IUser, IUserStore } from "~/types/user.type";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    getUserId: (state) => {
      return (state.user as any)._id;
    },
  },

  actions: {
    setUser(user: any) {
      this.user = user;
      this.isAuthenticated = true;
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
