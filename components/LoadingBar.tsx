"use client";

import useLoadingBar from "@/hooks/useLoadingBar";
import React, { useState } from "react";

import LoadingBar from "react-top-loading-bar";

interface LoadingBarModProps {
  children: React.ReactNode;
}

const LoadingBarMod: React.FC<LoadingBarModProps> = ({ children }) => {
  const { loadingProgress, stopLoading } = useLoadingBar();

  return (
    <>
      <LoadingBar
        className="bg-primary"
        progress={loadingProgress}
        height={4}
        shadow
        onLoaderFinished={() => stopLoading()}
      />
      {children}
    </>
  );
};

export default LoadingBarMod;
