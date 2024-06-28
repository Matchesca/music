import { jwtDecode } from "jwt-decode";
import { Song } from "@/types";
import axios from "axios";
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

const getSongsByUserId = async (): Promise<Song[]> => {

    const token = getCookie('token', { cookies });
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const response = await axios.post("http://localhost:4000/get-song-by-userid", {
                userId: userId
            });

            return response.data as Song[];
        } catch (error) {
            console.error("Error fetching songs:", error);
            return [];
        }
    }
    
    console.log("No token found");
    return [];
    
};

export default getSongsByUserId;