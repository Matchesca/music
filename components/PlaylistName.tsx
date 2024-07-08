"use client";

import usePlaylistRenameModal from "@/hooks/usePlaylistRenameModal";
import { Playlist, Song } from "@/types";

interface PlaylistNameProps {
  playlist: Playlist;
  songs: Song[];
  text: string;
}

const PlaylistName: React.FC<PlaylistNameProps> = ({
  playlist,
  songs,
  text,
}) => {
  const PlaylistRenameModal = usePlaylistRenameModal();
  const handleClick = () => {
    PlaylistRenameModal.onOpen(playlist.id);
  };
  return (
    <div
      className="flex flex-col gap-y-2 mt-4 md:mt-0 cursor-pointer"
      onClick={handleClick}
    >
      <p className="hidden md:block font-semibold text-sm">Playlist</p>
      <h1 className="text-9xl sm:text-5xl lg:text-7xl font-black antialiased tracking-tight">
        {playlist.name}
      </h1>
      <p>
        {songs.length}
        {text}
      </p>
    </div>
  );
};

export default PlaylistName;
