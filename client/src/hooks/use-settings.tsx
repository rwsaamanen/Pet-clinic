import { create } from "zustand";

type SettingsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  onOpen: () => {
    console.log("Opening settings");
    set({ isOpen: true });
  },
  onClose: () => set({ isOpen: false }),
}));
