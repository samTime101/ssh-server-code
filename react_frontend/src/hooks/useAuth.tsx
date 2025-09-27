import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  if (!AuthContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return useContext(AuthContext);
};
