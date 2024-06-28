import { Song } from "@/types";
import axios from "axios";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  try {
    if (!title) {
      const allSongs = await getSongs();
      return allSongs;
    }

    const response = await axios.post("http://localhost:4000/get-songs-by-title", { songTitle: title });

    const songs = response.data;

    if (!songs) {
      console.error("Invalid songs format");
      return [];
    }

    return songs as Song[];
  } catch (error) {
    console.error("Error fetching songs by title:", error);
    return [];
  }
};

export default getSongsByTitle;
