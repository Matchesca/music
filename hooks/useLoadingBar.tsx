import { create } from "zustand";

interface LoadingBarState {
  isLoading: boolean;
  loadingProgress: number;
  stopLoading: () => void;
  updateProgress: (progress: number) => void;
}

const useLoadingBarStore = create<LoadingBarState>((set) => ({
  isLoading: false,
  loadingProgress: 0,
  stopLoading: () => set({ isLoading: false, loadingProgress: 100 }),
  updateProgress: (progress) => set({ loadingProgress: progress }),
}));

const useLoadingBar = () => {
  const { isLoading, loadingProgress, updateProgress, stopLoading } =
    useLoadingBarStore();

  return {
    isLoading,
    loadingProgress,
    stopLoading,
    updateProgress,
  };
};

export default useLoadingBar;
