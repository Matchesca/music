"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-4 w-full h-[90px]">
      <div className="px-4 rounded-3xl dark:bg-black py-2 mx-10 bg-primary h-full">
        <PlayerContent
          key={songUrl}
          song={song}
          songUrl={songUrl}
        />
      </div>
    </div>
  );
};

export default Player;
