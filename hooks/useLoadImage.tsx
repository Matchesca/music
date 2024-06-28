import { Song } from "@/types";

const useLoadImage = (song: Song) => {
  if (!song) {
    return null;
  }

  return "/data/music/" + song.image_path;
};

export default useLoadImage;
