import Cookies from "js-cookie";
import axios from "axios";

export const login = async (email: string, password: string) => {
    try {
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
      const user = response.data.user
      return user;
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  export default login;