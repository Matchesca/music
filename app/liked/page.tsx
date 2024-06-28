import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import LikedContent from "@/components/LikedContent";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const revalidate = 0;

const Liked = async () => {
  const songs = await getLikedSongs();
  let text = " song";

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
                src="/liked.jpeg"
                alt="playlist"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className=" text-4xl sm:text-5xl lg:text-7xl font-bold">
                Liked Songs
              </h1>
              <p>
                {songs.length} {text}
              </p>
            </div>
          </div>
        </div>
      </Header>
      <Separator />
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;
