"use client";

import useLoadImage from "@/hooks/useLoadImage";
import Image from "@/node_modules/next/image";
import { Song } from "@/types";
import formatTime from "@/utils/TimeFormat";
import { twMerge } from "tailwind-merge";
import LikeButton from "./LikeButton";
import SongDropdown from "./SongDropdown";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
  className?: string;
  author?: boolean;
  dots?: boolean;
  playlistId?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  className,
  author,
  dots = false,
  playlistId,
}) => {
  const imageUrl = useLoadImage(data);

  let hidden = "";
  if (author === false) {
    hidden = "hidden";
  }

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    // TODO: Default turn on player
  };

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
    `,
          className
        )}
      >
        <div
          className="
        relative
        rounded-md
        min-h-[48px]
        min-w-[48px]
        overflow-hidden
      "
        >
          <Image
            fill
            src={imageUrl || "/images/liked.png"}
            alt="media item"
            className="object-cover"
          />
        </div>
        <div
          className="
        flex
        flex-col
        overflow-hidden
      "
        >
          <p className="dark:text-white truncate">{data.title}</p>
          <p
            className={twMerge(
              `dark:text-neutral-400 text-sm truncate font-thin`,
              hidden
            )}
          >
            {data.author}
          </p>
        </div>
      </div>
      <div
        className={twMerge(
          ``,
          dots ? "flex flex-row gap-x-2 pt-0.5 px-2" : "hidden"
        )}
      >
        <div className="opacity-0 group-hover:opacity-100">
          <LikeButton songId={data.id} />
        </div>
        <p className="font-light text-sm text-center pt-0.5">
          {formatTime(data.duration)}
        </p>
        <div className="opacity-0 group-hover:opacity-100">
          <SongDropdown
            songId={data.id}
            playlistId={playlistId}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaItem;
