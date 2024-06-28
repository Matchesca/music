import axios from "axios";
import { Song } from "@/types";

const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    
    try {
        const response = await axios.post("http://localhost:4000/get-playlist-songs", { playlistId });
        return response.data as Song[];
    } catch (error) {
        console.error("Error fetching songs of the playlist:", error);
        return [];
    }
};

export default getPlaylistSongs;