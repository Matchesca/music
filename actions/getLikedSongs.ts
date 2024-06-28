import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { Song } from "@/types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const getLikedSongs = async (): Promise<Song[]> => {
    
    try {
        const token = getCookie('token', {cookies});
        
        if (!token) {
        console.log("No token found");
        return [];
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const likedSongIdsResponse = await axios.post("http://localhost:4000/get-liked-song-ids", {
            userId: userId
        });

        const likedSongIds = likedSongIdsResponse.data;

        if (!likedSongIds || !Array.isArray(likedSongIds)) {
            console.error("Invalid liked song IDs format");
            return [];
        }

        // Second call to get songs by IDs
        const songsResponse = await axios.post("http://localhost:4000/get-songs-by-ids", {
            songIds: likedSongIds
        });

        const songs = songsResponse.data;

        if (!songs || !Array.isArray(songs)) {
            console.error("Invalid songs format");
            return [];
        }

        return songs as Song[];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export default getLikedSongs;