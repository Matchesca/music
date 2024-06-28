import { useUser } from "@/hooks/useUser";
import { Playlist, Song } from "@/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { Trash } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import getPlaylistSongs from "@/actions/getPlaylistSongs";
import { useEffect, useState } from "react";
import useLoadImage from "@/hooks/useLoadImage";

interface PlaylistLibraryCardProps {
  playlist: Playlist;
  handleClick: () => void;
  handleDelete: () => void;
}

const PlaylistLibraryCard: React.FC<PlaylistLibraryCardProps> = ({
  playlist,
  handleClick,
  handleDelete,
}) => {
  const user = useUser();
  const [songs, setSongs] = useState<Song[]>();

  useEffect(() => {
    const fetchSongs = async () => {
      const songs = await getPlaylistSongs(playlist.id);
      setSongs(songs);
    };
    fetchSongs();
  });

  let imageUrl1 = null;
  let imageUrl2 = null;
  let imageUrl3 = null;
  let imageUrl4 = null;

  if (songs) {
    if (songs.length <= 1 && songs.length > 0) {
      imageUrl1 = useLoadImage(songs[0]);
    } else if (songs.length <= 2) {
      imageUrl4 = useLoadImage(songs[1]);
      imageUrl1 = useLoadImage(songs[0]);
    } else if (songs.length <= 3) {
      imageUrl3 = useLoadImage(songs[2]);
      imageUrl4 = useLoadImage(songs[1]);
      imageUrl1 = useLoadImage(songs[0]);
    } else if (songs.length > 3) {
      imageUrl2 = useLoadImage(songs[3]);
      imageUrl3 = useLoadImage(songs[2]);
      imageUrl4 = useLoadImage(songs[1]);
      imageUrl1 = useLoadImage(songs[0]);
    }
  }

  const router = useRouter();

  return (
    <div
      className="flex items-center group dark:hover:bg-neutral-800/50
        hover:bg-neutral-200 cursor-pointer rounded-md"
    >
      <div
        onClick={handleClick}
        className={twMerge(
          `
        flex 
        items-center
        gap-x-3 
        w-full 
        p-2 
    `
        )}
      >
        <div
          className="
        relative
        rounded-md
        h-[48px]
        w-[48px]
        overflow-hidden
        grid grid-cols-2
      "
        >
          <div>
            <Image
              src={imageUrl1 || "/liked.jpeg"}
              alt="image"
              width={24}
              height={24}
            />
          </div>
          <div>
            <Image
              src={imageUrl2 || "/liked.jpeg"}
              alt="image"
              width={24}
              height={24}
            />
          </div>
          <div>
            <Image
              src={imageUrl3 || "/liked.jpeg"}
              alt="image"
              width={24}
              height={24}
            />
          </div>
          <div>
            <Image
              src={imageUrl4 || "/liked.jpeg"}
              alt="image"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div
          className="
        flex
        flex-col
        overflow-hidden
      "
        >
          <p className="dark:text-white truncate">{playlist.name}</p>
          <p className="dark:text-neutral-400 text-sm truncate font-thin antialiased">
            {user?.userName}
          </p>
        </div>
      </div>
      <div
        className="text-red-600 opacity-0 group-hover:opacity-100 mr-2"
        onClick={() => handleDelete()}
      >
        <Trash className="h-4 w-4 hover:h-5 hover:w-5 transition" />
      </div>
    </div>
  );
};

export default PlaylistLibraryCard;
