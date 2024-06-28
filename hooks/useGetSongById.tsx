import { Song } from "@/types";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/get-song-by-id",
          { id }
        );

        if (response.data.error) {
          setIsLoading(false);
          return toast.error(response.data.error);
        }

        setSong(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching the song."
        );
      }
    };

    fetchSong();
  }, [id]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};

export default useGetSongById;
