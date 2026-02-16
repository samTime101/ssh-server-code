import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ResetPhoneNumberForm } from "@/types/auth";
import { resetPhoneNumberService } from "@/services/user/settings-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const usePhoneNumberReset = () => {
  const [loading, setLoading] = useState(false);
  const { refreshUserData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPhoneNumberForm>();

  const onSubmit = async (data: ResetPhoneNumberForm) => {
    setLoading(true);
    try {
      await resetPhoneNumberService({
        new_phonenumber: data.new_phonenumber,
      });
      toast.success("Phone number updated successfully!");
      reset();
      await refreshUserData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to update phone number";
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
  };
};
