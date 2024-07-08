import { create } from "zustand";

interface PlaylistRenameModalStore {
  isOpen: boolean;
  playlistId: string | null; // Add playlistId to the state
  onOpen: (playlistId: string) => void; // Modify onOpen to accept a playlistId
  onClose: () => void;
}

const usePlaylistRenameModal = create<PlaylistRenameModalStore>((set) => ({
  isOpen: false,
  playlistId: null,
  onOpen: (playlistId) => set({ isOpen: true, playlistId }), // Store playlistId in the state
  onClose: () => set({ isOpen: false, playlistId: null }), // Reset playlistId on close
}));

export default usePlaylistRenameModal;
