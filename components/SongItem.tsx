"use client";

import useLoadImage from "@/hooks/useLoadImage";
import Image from "@/node_modules/next/image";
import { Song } from "@/types";
import PlayButton from "./PlayButton";
import SongDropdown from "./SongDropdown";
import Card from "@mui/material/Card";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import SongBadge from "./SongBadge";

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);
  const color = useDynamicTheme(imagePath, 100, false);
  return (
    <Card
      onClick={() => onClick(data.id)}
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 hover:bg-neutral-200 dark:bg-neutral-400/5 cursor-pointer dark:hover:bg-neutral-400/10 transition p-3"
      sx={{
        color,
      }}
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          fill
          className="object-cover"
          src={imagePath || "/images.liked.png"}
          alt="Image"
        />
      </div>

      <div className="flex flex-col items-start w-full pt-4">
        <p className="font-semibold truncate w-full">{data.title}</p>
        <p className="font-light text-sm text-neutral-700 pb-4 w-full truncate">
          {data.author}
        </p>
        <div>
          <SongBadge
            song={data}
            className="bg-neutral-600 text-xs font-semibold"
          />
        </div>
      </div>

      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
      <div className="absolute top-4 right-5 group-hover:opacity-100 opacity-0 transition">
        <SongDropdown songId={data.id} />
      </div>
    </Card>
  );
};

export default SongItem;
