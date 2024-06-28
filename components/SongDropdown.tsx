"use client";

import { MoreHorizontal, Trash, Plus } from "lucide-react";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import getUserPlaylists from "@/actions/getUserPlaylists";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Playlist, Song } from "@/types";
import toast from "react-hot-toast";
import getPlaylistSongs from "@/actions/getPlaylistSongs";

interface SongDropdownProps {
  songId: string;
  playlistId?: string;
}

const SongDropdown: React.FC<SongDropdownProps> = ({ songId, playlistId }) => {
  const router = useRouter();
  const user = useUser();
  const [playlists, setPlaylists] = useState<Playlist[] | null>();
  const [songs, setSongs] = useState<Song[]>();

  // find all the playlists of the current logged in user
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (user) {
        const playlistsData = await getUserPlaylists(user.email);
        setPlaylists(playlistsData);
      }
    };

    fetchPlaylists();
  }, [user]);

  const handleDeleteFromPlaylist = async () => {
    const response = await axios.post(
      "http://localhost:4000/remove-song-from-playlist",
      { playlistId, songId }
    );
    router.refresh();
  };

  const handleDelete = async () => {
    try {
      await axios.post("http://localhost:4000/delete-song", { songId });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaylistAdding = async (playlistId: string) => {
    try {
      await axios.post("http://localhost:4000/playlist-add-song", {
        playlistId,
        songId,
      });
      toast.success(`Song added to the playlist`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none hover:opacity-50">
          <MoreHorizontal />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {playlists && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add to Playlist</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {playlists.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() => {
                        handlePlaylistAdding(playlist.id); // Pass playlist.id directly
                      }}
                    >
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}
        {playlistId && (
          <>
            <DropdownMenuItem onClick={handleDeleteFromPlaylist}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Remove from this playlist</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          className="text-red-600"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SongDropdown;
