import { create } from "zustand";

type SettingsStore = {

  // Boolean to track if the settings are open or closed.

  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

// Creating a Zustand store named useSettings.

export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,

  // onOpen

  onOpen: () => {
    console.log("Opening settings");
    set({ isOpen: true });
  },

  // onClose

  onClose: () => set({ isOpen: false }),
}));
