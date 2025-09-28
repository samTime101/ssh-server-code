import { loginService, signupService } from "@/services/auth";
import type { LoginRequest, SignupRequest, User } from "@/types/auth";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

let globalLogout: (() => void) | null = null;
export const getGlobalLogout = () => globalLogout;

export const AuthContext = createContext<{
  login: (data: LoginRequest) => void;
  logout: () => void;
  token: string | null;
  register: (data: SignupRequest) => void;
  user: User | null;
}>({
  login: () => {},
  logout: () => {},
  token: null,
  register: () => {},
  user: null,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );

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
