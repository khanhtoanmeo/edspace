import { create } from "zustand";

const useAppStore = create((set) => ({
  state: "AUTH",
  logOut: () => set({ state: "AUTH" }),
  logIn: () => set({ state: "ACTIVE" }),
}));

export default useAppStore;
