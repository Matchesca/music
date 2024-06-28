"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import PlaylistLibrary from "./PlaylistLibrary";
import { Separator } from "./ui/separator";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const user = useUser();
  const onPlay = useOnPlay(songs);
  const uploadModal = useUploadModal();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    // TODO: check for subscription

    return uploadModal.onOpen();
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="inline-flex items-center gap-x-2">
            {/* <TbPlaylist
            className="dark:text-neutral-400"
            size={26}
          /> */}
            <p className="ml-4 scroll-m-20 text-2xl font-semibold tracking-tight">
              Library
            </p>
          </div>
          <AiOutlinePlus
            onClick={onClick}
            size={20}
            className="dark:text-neutral-400 cursor-pointer dark:hover:text-white hover:text-neutral-500 transition"
          />
        </div>
        {/* <div className="">Recent additions</div> */}
        <div className="flex flex-col gap-y-2 mt-2 px-3 h-[192px] overflow-auto">
          <div className="">
            {songs.map((item) => (
              <MediaItem
                onClick={(id: string) => {
                  onPlay(id);
                }}
                key={item.id}
                data={item}
              />
            ))}
          </div>
        </div>
      </div>
      <PlaylistLibrary />
    </div>
  );
};

export default Library;
