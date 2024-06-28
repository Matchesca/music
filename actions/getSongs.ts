import { getCookie } from 'cookies-next';
import axios from "axios";
import { cookies } from "next/headers";
import { Song } from "@/types";

const getSongs = async (): Promise<Song[]> => {
    const token ="Yes";
    if (token) {
        try {

            const response = await axios.post("http://localhost:4000/get-all-song", {
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

export default getSongs;