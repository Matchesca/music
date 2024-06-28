"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import useLoginModal from "@/hooks/useLoginModal";
import { useUser } from "@/hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LoginModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useLoginModal();
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
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <form
        className="flex flex-col gap-y-2"
        onSubmit={handleLogin}
      >
        <div>
          <div className="py-1">Enter your email</div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <div className="py-1">Enter your password</div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
