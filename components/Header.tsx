"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { Button } from "./ui/button";
import useAuthModal from "@/hooks/useAuthModal";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider";
import useLoginModal from "@/hooks/useLoginModal";
import { ModeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const loginModal = useLoginModal();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // TODO: Reset any playing songs
    router.refresh();
  };
  return (
    <div
      className={twMerge(
        `
    h-fit
    dark:bg-gradient-to-b
    from-emerald-800
    p-6
  `,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-primary flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft
              className="text-white"
              size={35}
            />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-primary flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight
              className="text-white"
              size={35}
            />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          >
            <HiHome
              className="text-black"
              size={28}
            />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          >
            <BiSearch
              className="text-black"
              size={28}
            />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-2 items-center">
              <ModeToggle />
              <Button onClick={handleLogout}>Logout</Button>
              <Button onClick={() => router.push("/account")}>
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <ModeToggle />
              <div>
                <Button onClick={authModal.onOpen}>Sign up</Button>
              </div>
              <div>
                <Button onClick={loginModal.onOpen}>Log in</Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
