import getPlaylist from "@/actions/getPlaylist";
import getPlaylistSongs from "@/actions/getPlaylistSongs";
import Header from "@/components/Header";
import PlaylistContent from "@/components/PlaylistContent";
import PlaylistName from "@/components/PlaylistName";
import { Separator } from "@/components/ui/separator";
import useLoadImage from "@/hooks/useLoadImage";
import { Playlist, Song } from "@/types";
import Image from "next/image";
import { useEffect } from "react";

export const revalidate = 0;

const Page = async ({ params }: { params: { playlistId: string } }) => {
  let text = " song";

  const playlist: Playlist = await getPlaylist(params.playlistId);
  const songs = await getPlaylistSongs(playlist.id);

  let cover_image = "/liked.jpeg";
  const temp = useLoadImage(songs[0]);
  if (temp) {
    cover_image = temp;
  }

  if (songs.length > 1) {
    text += "s";
  }

  return (
    <div
      className="
        dark:bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
    "
    >
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src={cover_image}
                alt="playlist"
                className="object-cover"
              />
            </div>
            <PlaylistName
              playlist={playlist}
              songs={songs}
              text={text}
            />
          </div>
        </div>
      </Header>
      <Separator />
      <PlaylistContent
        songs={songs}
        playlistId={playlist.id}
      />
    </div>
  );
};

export default Page;
