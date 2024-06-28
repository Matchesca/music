"use client";

import axios from "axios";

import { useRouter } from "next/navigation";
import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/providers/AuthProvider";

const AuthModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const { register } = useAuth();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleRegister = async () => {
    try {
      register(email, password, userName);
    } catch (error) {
      console.error("Register Failed", error);
    }
  };

  return (
    <Modal
      title="Register"
      description="Create your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <form
        className="flex flex-col gap-y-2"
        onSubmit={handleRegister}
      >
        <input
          type="user name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </Modal>
  );
};

export default AuthModal;
