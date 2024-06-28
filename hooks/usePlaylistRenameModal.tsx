import { create } from "zustand";

interface PlaylistRenameModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlaylistRenameModal = create<PlaylistRenameModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePlaylistRenameModal;
