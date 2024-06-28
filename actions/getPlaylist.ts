import { Playlist } from "@/types"
import axios from "axios";

const emptyPlaylist: Playlist = {
    id: '',
    name: '',
    isPublic: false,
    userId: ''
};

const getPlaylist = async (playlistId: string):Promise<Playlist> => {

    try {

        const response = await axios.post("http://localhost:4000/get-playlist-by-id", {playlistId})
        const playlist = response.data.playlist; // Extract the playlist from the response
        return {
            id: playlist.id,
            name: playlist.name,
            isPublic: playlist.is_public,
            userId: playlist.user_id
        } as Playlist;
    } catch (error) {
        return emptyPlaylist
    }

}

export default getPlaylist;