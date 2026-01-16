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
      const response = await axiosInstance.get(API_ENDPOINTS.accountInfo, {
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

  const handleAuthSuccess = (accessToken: string) => {
    setUser(user);
    setToken(accessToken);
    navigate("/");
    // localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
  };

  const login = async ({ email, password }: LoginRequest) => {
    try {
      const response = await loginService({ email, password });
      if (response) {
        // Check if email is verified
        const userInfo = await fetchUserInfo(response.data.access);

        if (userInfo && !userInfo.is_email_verified) {
          toast.error("Check your email to verify your account.");
          logout();
          return;
        }

        toast.success("Login successful! Welcome back.");
        handleAuthSuccess(response.data.access);
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
    first_name,
    last_name,
    password,
    college,
  }: SignupRequest) => {
    try {
      const response = await signupService({
        email,
        username,
        phonenumber,
        first_name,
        last_name,
        password,
        college,
      });
      if (response) {
        toast.success("Registration successful! Check your email to verify your account.");
        navigate("/auth/login");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Try to extract detailed error messages from backend
      let errorMsg = "Registration failed. Please try again.";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "object" && data !== null) {
          // Show only the first error message, capitalized
          let firstMsg = "";
          for (const msg of Object.values(data)) {
            if (Array.isArray(msg) && msg.length > 0) {
              firstMsg = msg[0];
              break;
            } else if (typeof msg === "string" && msg) {
              firstMsg = msg;
              break;
            }
          }
          if (firstMsg) {
            errorMsg = firstMsg.charAt(0).toUpperCase() + firstMsg.slice(1);
          }
        } else if (typeof data === "string" && data) {
          errorMsg = data.charAt(0).toUpperCase() + data.slice(1);
        }
      }
      toast.error(errorMsg);
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
