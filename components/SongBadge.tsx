import { Song } from "@/types";
import { Badge } from "./ui/badge";

interface SongBadgeProps {
  song: Song;
  className: string;
}

const SongBadge: React.FC<SongBadgeProps> = ({ song, className }) => {
  const fileExtension = song.song_path.split(".").pop();

  return <Badge className={className}>{fileExtension}</Badge>;
};

export default SongBadge;
