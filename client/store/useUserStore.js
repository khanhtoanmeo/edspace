import { create } from "zustand";

const useUserStore = create((set) => ({
  id: null,
  setId(id) {
    return set({ id: id });
  },
}));

export default useUserStore;
