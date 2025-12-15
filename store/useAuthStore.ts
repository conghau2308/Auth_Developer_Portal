import { create } from "zustand";

type AuthState = {
  isLogin: boolean;
  isAuthChecked: boolean;
  setIsLogin: (v: boolean) => void;
  setAuthChecked: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  isAuthChecked: false,
  setIsLogin: (v) => set({ isLogin: v }),
  setAuthChecked: (v) => set({ isAuthChecked: v }),
}));
