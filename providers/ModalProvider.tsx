"use client";

import AuthModal from "@/components/AuthModal";
import LoginModal from "@/components/LoginModal";
import PlaylistRenameModal from "@/components/PlaylistRenameModal";
import UploadModal from "@/components/UploadModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AuthModal />
      <UploadModal />
      <LoginModal />
      <PlaylistRenameModal />
    </>
  );
};

export default ModalProvider;
