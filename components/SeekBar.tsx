"use client";

import React, { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

interface SeekBarProps {
  seekValue: number;
  onSeek?: (value: number) => void;
  duration: number;
}

const SeekBar: React.FC<SeekBarProps> = ({ onSeek, seekValue, duration }) => {
  const handleSeek = (newValue: number[]) => {
    onSeek?.(newValue[0]);
  };

  // Helper function to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate elapsed and remaining time
  const elapsed = (seekValue / 100) * duration;
  const remaining = duration - elapsed;

  return (
    <div className="flex flex-row w-[500px]">
      <p className="mx-1 w-[45px] text-center text-xs font-light text-neutral-900 dark:text-neutral-400">
        {formatTime(elapsed)}
      </p>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5 bottom-0.5 group"
        onValueChange={handleSeek}
        value={[seekValue]}
      >
        <Slider.Track className="bg-black dark:bg-neutral-500 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-white rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-2 h-2 bg-white rounded-[10px] hover:shadow-[0_2px_10px] group-hover:w-4 group-hover:h-4 focus:outline-none transition"
          aria-label="Seek"
        />
      </Slider.Root>
      <p className="mx-1 text-neutral-900 w-[45px] text-center text-xs font-light dark:text-neutral-400">
        {formatTime(remaining)}
      </p>
    </div>
  );
};

export default SeekBar;
