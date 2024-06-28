"use client";

import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import useSound from "use-sound";

import { Song } from "@/types";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import { AiFillBackward, AiFillForward } from "react-icons/ai";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useRef, useState } from "react";
import SeekBar from "./SeekBar";
import {
  SpeakerLoudIcon,
  SpeakerOffIcon,
  SpeakerModerateIcon,
  SpeakerQuietIcon,
} from "@radix-ui/react-icons";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const duration = song.duration;

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  let VolumeIcon = SpeakerLoudIcon;
  const animationRef = useRef<number>();

  if (volume > 0.6) {
    VolumeIcon = SpeakerLoudIcon;
  } else if (volume > 0.35) {
    VolumeIcon = SpeakerModerateIcon;
  } else if (volume > 0) {
    VolumeIcon = SpeakerQuietIcon;
  } else {
    VolumeIcon = SpeakerOffIcon;
  }

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const prevSong = player.ids[currentIndex - 1];

    if (!prevSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(prevSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3", "flac"],
  });

  useEffect(() => {
    if (sound) {
      const updateSeekValue = () => {
        setSeekValue((sound.seek() / duration) * 100);
        animationRef.current = requestAnimationFrame(updateSeekValue);
      };

      updateSeekValue();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [sound, duration]);

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const handleSeek = (time: number) => {
    if (sound) {
      sound.seek((time / 100) * duration);
      setSeekValue((sound.seek() / (duration || 1)) * 100);
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem
            data={song}
            author={false}
          />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon
            size={30}
            className="text-black"
          />
        </div>
      </div>
      <div className="hidden h-full md:flex md:flex-col justify-center items-center w-full max-w-[722px] gap-x-6">
        <div className="flex w-full justify-center items-center gap-x-6 h-full">
          <AiFillBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-white dark:text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon
              size={40}
              className="text-black"
            />
          </div>
          <AiFillForward
            onClick={onPlayNext}
            size={30}
            className="text-white dark:text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div>
          <SeekBar
            onSeek={handleSeek}
            seekValue={seekValue}
            duration={duration}
          />
        </div>
      </div>
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer text-white w-7 h-7"
          />
          <Slider
            value={volume}
            onChange={(value) => setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
