import { API_ENDPOINTS } from "@/config/apiConfig";
import { googleLogin, googleSignup, loginService, signupService } from "@/services/auth";
import axiosInstance from "@/services/axios";
import type { GoogleSignupRequest, LoginRequest, SignupRequest, User } from "@/types/auth";
import { normalizeGoogleSignupPending } from "@/utils/googleAuthUtils";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAlreadyExistsErrors, extractBackendErrorMessages } from "@/utils/errorUtils";

let globalLogout: (() => void) | null = null;
export const getGlobalLogout = () => globalLogout;

export const AuthContext = createContext<{
  login: (data: LoginRequest) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  completeGoogleSignup: (data: GoogleSignupRequest) => Promise<void>;
  logout: () => void;
  token: string | null;
  register: (data: SignupRequest) => Promise<void>;
  user: User | null;
  refreshUserData: () => Promise<void>;
}>({
  login: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  completeGoogleSignup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  token: null,
  register: () => Promise.resolve(),
  user: null,
  refreshUserData: () => Promise.resolve(),
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

  const handleAuthSuccess = (accessToken: string, fetchedUser: User | null) => {
    setUser(fetchedUser);
    setToken(accessToken);
    navigate("/");
    // localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
  };

  const login = async ({ email, password, recaptcha }: LoginRequest) => {
    try {
      const response = await loginService({ email, password, recaptcha });
      if (response) {
        // Check if email is verified
        const userInfo = await fetchUserInfo(response.data.access);

        if (userInfo && !userInfo.is_email_verified) {
          toast.error("Please verify your email address to sign in.");
          logout();
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        toast.success("Login successful! Welcome back.");
        handleAuthSuccess(response.data.access, userInfo);
      }
    } catch (error: any) {
      if (error.message === "EMAIL_NOT_VERIFIED") {
        throw error;
      }

      console.error("Login failed:", error);
      const detail = error.response?.data?.detail;
      const recaptchaError = error.response?.data?.recaptcha;
      if (!recaptchaError) {
        toast.error(detail || "Login failed. Please check your credentials.");
      }
      logout();
      throw error;
    }
  };

  const loginWithGoogle = async (code: string) => {
    try {
      const response = await googleLogin({ code });
      const data = response.data;

      if (data.is_new_user) {
        const pending = normalizeGoogleSignupPending(data);
        if (!pending) {
          toast.error("Google sign-in incomplete. Please try again.");
          throw new Error("GOOGLE_SIGNUP_TOKEN_MISSING");
        }
        navigate("/auth/complete-profile", { state: { googleSignup: pending } });
        return;
      }

      const userInfo = await fetchUserInfo(data.access);
      toast.success("Login successful! Welcome back.");
      handleAuthSuccess(data.access, userInfo);
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error.message === "GOOGLE_SIGNUP_TOKEN_MISSING") {
        throw error;
      }
      const detail = error.response?.data?.detail;
      toast.error(detail || "Google sign-in failed. Please try again.");
      throw error;
    }
  };

  const completeGoogleSignup = async ({
    signup_token,
    username,
    phonenumber,
    college,
  }: GoogleSignupRequest) => {
    try {
      const response = await googleSignup({
        signup_token,
        username,
        phonenumber,
        college,
      });
      const userInfo = await fetchUserInfo(response.data.access);
      toast.success("Account created successfully! Welcome.");
      handleAuthSuccess(response.data.access, userInfo);
    } catch (error: any) {
      console.error("Google signup failed:", error);
      if (error?.response?.data && typeof error.response.data === "object") {
        const messages = getAlreadyExistsErrors(error.response.data);
        if (messages.length > 0) {
          messages.forEach((msg) => toast.error(msg));
          throw error;
        }
        const signupTokenError = error.response.data.signup_token;
        if (Array.isArray(signupTokenError) && signupTokenError[0]) {
          toast.error(signupTokenError[0]);
          throw error;
        }
        if (error.response.data.detail) {
          toast.error(error.response.data.detail);
          throw error;
        }
        const otherMessages = extractBackendErrorMessages(error.response.data).filter(
          (msg) =>
            !msg.toLowerCase().includes("username") &&
            !msg.toLowerCase().includes("phonenumber") &&
            !msg.toLowerCase().includes("college")
        );
        if (otherMessages.length > 0) {
          otherMessages.forEach((msg) => toast.error(msg));
          throw error;
        }
        throw error;
      }
      toast.error("Failed to complete Google signup. Please try again.");
      throw error;
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
    confirm_password,
    college,
    recaptcha,
  }: SignupRequest) => {
    try {
      const response = await signupService({
        email,
        username,
        phonenumber,
        first_name,
        last_name,
        password,
        confirm_password,
        college,
        recaptcha,
      });
      if (response) {
        toast.success("Registration successful! Check your email to verify your account.");
        // navigate("/auth/login");
        if (!token) {
          navigate("/auth/login");
        }
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error?.response?.data?.recaptcha) {
        // Handled inline on the signup form
        throw error;
      }
      if (error?.response?.data && typeof error.response.data === "object") {
        const messages = getAlreadyExistsErrors(error.response.data);
        if (messages.length > 0) {
          messages.forEach((msg) => toast.error(msg));
          throw error;
        }
      }
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };
  const refreshUserData = async () => {
    if (token) {
      const fetchedUser = await fetchUserInfo(token);
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        loginWithGoogle,
        completeGoogleSignup,
        logout,
        token,
        register,
        user,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
