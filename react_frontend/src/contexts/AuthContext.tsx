import { API_ENDPOINTS } from "@/config/apiConfig";
import { loginService, signupService } from "@/services/auth";
import axiosInstance from "@/services/axios";
import type { LoginRequest, SignupRequest, User } from "@/types/auth";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

let globalLogout: (() => void) | null = null;
export const getGlobalLogout = () => globalLogout;

export const AuthContext = createContext<{
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  token: string | null;
  register: (data: SignupRequest) => Promise<void>;
  user: User | null;
}>({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  token: null,
  register: () => Promise.resolve(),
  user: null,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    if (token) {
      fetchUserInfo(token).then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          logout();
        }
      });
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    console.log("AuthContext user changed:", user);
  }, [user]);

  const fetchUserInfo = async (accessToken: string): Promise<User | null> => {
    if (!accessToken) return null;

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.userInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) {
        logout();
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  };

  const handleAuthSuccess = (user: User, accessToken: string) => {
    setUser(user);
    setToken(accessToken);
    navigate("/");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
  };

  const login = async ({ email, password }: LoginRequest) => {
    try {
      const response = await loginService({ email, password });
      if (response) {
        toast.success("Login successful! Welcome back.");
        handleAuthSuccess(response.data.user, response.data.tokens.access);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  // Store the logout function globally
  globalLogout = logout;

  const register = async ({
    email,
    username,
    phonenumber,
    firstname,
    lastname,
    password,
  }: SignupRequest) => {
    try {
      const response = await signupService({
        email,
        username,
        phonenumber,
        firstname,
        lastname,
        password,
      });
      if (response) {
        toast.success("Registration successful! Welcome aboard.");
        // handleAuthSuccess(response.data.user, response.data.tokens.access);
        login({ email, password });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
      logout();
    }
  };
  return (
    <AuthContext.Provider value={{ login, logout, token, register, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
