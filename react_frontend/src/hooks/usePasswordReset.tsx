import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ResetPasswordForm } from "@/types/auth";
import { resetPasswordService } from "@/services/user/settings-service";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordForm>();

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    try {
      await resetPasswordService({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      });
      toast.success("Password changed successfully!");
      reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
