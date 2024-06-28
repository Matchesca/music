"use client";

import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { useUser } from "@/hooks/useUser";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Playlist } from "@/types";
import getUserPlaylists from "@/actions/getUserPlaylists";
import PlaylistLibraryCard from "./PlaylistLibraryCard";

const PlaylistLibrary = () => {
  const user = useUser();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[] | null>();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (user) {
        const playlistsData = await getUserPlaylists(user.email);
        setPlaylists(playlistsData);
      }
    };

    fetchPlaylists();
  }, [user, router]);

  const handlePlaylistDelete = async (playlistId: string) => {
    try {
      if (user) {
        const response = await axios.post(
          "http://localhost:4000/delete-playlist",
          {
            playlistId: playlistId,
          }
        );

        // If deletion is successful, update playlists state by refetching
        const updatedPlaylists = await getUserPlaylists(user.email);
        setPlaylists(updatedPlaylists);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    if (user) {
      const response = await axios.post(
        "http://localhost:4000/generate-playlist",
        {
          userId: user.email,
        }
      );
      router.push(`/playlist/${response.data.playlistId}`);
      const updatedPlaylists = await getUserPlaylists(user.email);
      setPlaylists(updatedPlaylists);
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          {/* <TbPlaylist
            className="dark:text-neutral-400"
            size={26}
          /> */}
          <p className="ml-4 scroll-m-20 text-2xl font-semibold tracking-tight">
            Playlists
          </p>
        </div>
        <AiOutlinePlus
          onClick={handleClick}
          size={20}
          className="dark:text-neutral-400 cursor-pointer dark:hover:text-white hover:text-neutral-500 transition"
        />
      </div>
      {playlists && (
        <div className="flex flex-col gap-y-2 mt-2 px-3 h-[361px] overflow-auto">
          <div className="">
            {playlists.map((item) => (
              <PlaylistLibraryCard
                key={item.id}
                playlist={item}
                handleClick={() => {
                  router.push(`/playlist/${item.id}`);
                }}
                handleDelete={() => handlePlaylistDelete(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistLibrary;
