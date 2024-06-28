"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    userName: string
  ) => Promise<void>;
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      // Check if token is expired
      if (decodedToken.exp * 1000 > Date.now()) {
        // Token is still valid, create a User object and set the user
        const user: User = {
          email: decodedToken.userId, // Assuming userId is present in the token
          userName: decodedToken.username, // Assuming username is present in the token
        };
        setUser(user);
      } else {
        // Token expired, logout user
        logout();
      }
    }
  }, []);

  // Function to handle user login
  const login = async (email: string, password: string) => {
    try {
      console.log("Trying to log in");
      const response = await axios.post(
        "http://localhost:4000/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // Ensure credentials (cookies) are sent
        }
      );
      setUser(response.data.user);
      console.log("Logged In");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      Cookies.remove("token");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // function to handle use register
  const register = async (
    email: string,
    password: string,
    userName: string
  ) => {
    try {
      const response = await axios.post("http://localhost:4000/register", {
        email,
        password,
        userName,
      });
      console.log("Registered Successfully!");
      login(email, password);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If the error response status is 400 (Bad Request),
        // it means the user already exists, so log in instead
        console.log("User already exists. Logging in...");
        login(email, password);
      } else {
        // If the error is not due to an existing user, log the error
        console.log("Registration failed", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
