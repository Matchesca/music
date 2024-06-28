import { Playlist } from "@/types"
import axios from "axios";

const getUserPlaylists = async (userId: string):Promise<Playlist[] | null> => {

    try {

        const response = await axios.post("http://localhost:4000/get-user-playlists", {userId})
        const playlist = response.data; // Extract the playlists from the response

        if (playlist.length === 0) {
            return null
        }

        return playlist as Playlist[]

    } catch (error) {
        console.log(error)
        return null
    }

}

export default getUserPlaylists;