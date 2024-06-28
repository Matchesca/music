"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePlaylistRenameModal from "@/hooks/usePlaylistRenameModal";

const PlaylistRenameModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = usePlaylistRenameModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.refresh();
    } catch (error) {
      console.error("Login failed", error);
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
        onSubmit={handleLogin}
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
