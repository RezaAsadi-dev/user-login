import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isHydrated: false,
      login: (userData: User) => {
        set({ user: userData, isLoading: false });
      },
      logout: () => {
        set({ user: null, isLoading: false });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
