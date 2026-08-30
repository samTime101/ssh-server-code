import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { setupAdminService } from "@/services/auth";
import type { SetupAdminRequest } from "@/types/auth";
import { getApiErrorMessage } from "@/utils/errorUtils";
import { getCurrentHostname, isPlatformHost } from "@/config/tenant";

export const useSetupAdmin = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isOnPlatformHost = isPlatformHost();
  const currentHost = getCurrentHostname();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SetupAdminRequest>();

  const password = watch("password");

  const onSubmit = async (data: SetupAdminRequest) => {
    if (!token) {
      setMessage("Invalid setup link");
      return;
    }
    if (isOnPlatformHost) {
      setMessage("Open this link on the organization subdomain to finish setup.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const response = await setupAdminService(token, data);
      setMessage(response.data?.detail || "Administrator account set up successfully.");
      setIsSuccess(true);
      reset();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Failed to set up administrator account"));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    isLoading,
    isSuccess,
    message,
    showPassword,
    showConfirmPassword,
    isOnPlatformHost,
    currentHost,
    errors,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setShowPassword,
    setShowConfirmPassword,
    password,
    goToLogin: () => navigate("/auth/login"),
  };
};
