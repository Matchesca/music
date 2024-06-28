"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();

  const authModal = useAuthModal();
  const user = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:4000/get-if-song-liked",
        {
          userId: user.email,
          songId: songId,
        }
      );

      if (response.data && response.data.liked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };
    fetchData();
  }, [songId, user?.email]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const response = await axios.post("http://localhost:4000/unlike-song", {
        userId: user.email,
        songId: songId,
      });
      if (response.status === 200) {
        toast.success("UnLiked");
      } else {
        toast.error(response.data.error);
      }
      setIsLiked(false);
    } else {
      const response = await axios.post("http://localhost:4000/like-song", {
        userId: user.email,
        songId: songId,
      });
      if (response.status === 200) {
        toast.success("Liked");
      } else {
        toast.error(response.data.error);
      }
      setIsLiked(true);
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleLike}
      className="
        hover:opacity-75
        transition
    "
    >
      <Icon
        color={isLiked ? "#22c55e" : "black"}
        size={25}
      />
    </button>
  );
};

export default LikeButton;
