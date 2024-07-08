"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePlaylistRenameModal from "@/hooks/usePlaylistRenameModal";

const PlaylistRenameModal = () => {
  const router = useRouter();
  const { onClose, isOpen, playlistId } = usePlaylistRenameModal();
  const [newName, setNewName] = useState("");
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.refresh();
      onClose();
    }
  }, [user, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/rename-playlist", {
        playlistId,
        newName,
      });
      onClose();
      router.refresh();
      console.log("Playlist rename successfull");
    } catch (error) {
      console.error("Playlist rename failed", error);
    }
  };

  return (
    <Modal
      title="Edit Details"
      description=""
      isOpen={isOpen}
      onChange={onChange}
    >
      <form
        className="flex flex-col gap-y-2"
        onSubmit={handleRename}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="h-[200px] w-[200px] bg-neutral-800 text-center group cursor-pointer">
            <div className="pt-[93px] text-neutral-200 opacity-0 group-hover:opacity-100">
              Choose photo
            </div>
          </div>
          <div className="gap-y-2 flex flex-col">
            <div>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Playlist name"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Optional Description"
                className="h-[140px]"
              />
            </div>
          </div>
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  );
};

export default PlaylistRenameModal;
