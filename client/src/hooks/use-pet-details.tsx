import { create } from "zustand";

type Pet = {
  _id: string;
  name: string;
  status: string;
};

type PetDetailsStore = {
  isOpen: boolean;
  pet: Pet | null;
  onOpen: (pet: Pet) => void;
  onClose: () => void;
};

export const useEditDetails = create<PetDetailsStore>((set) => ({
  isOpen: false,
  pet: null,
  onOpen: (pet) => set({ isOpen: true, pet }),
  onClose: () => set({ isOpen: false, pet: null }),
}));
