import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FormErrorMessage from "@/components/FormErrorMessage";
import AuthLayout from "@/layouts/AuthLayout";
import { verifyPasswordResetService } from "@/services/auth";
import type { ResetPasswordVerifyRequest } from "@/types/auth";

const ResetPasswordPage = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordVerifyRequest>();

  const onSubmit = async (data: ResetPasswordVerifyRequest) => {
    if (!token) {
      setMessage("Invalid reset link");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyPasswordResetService(token, data);
      setMessage(response.data?.detail || "Password has been reset successfully.");
      setIsSuccess(true);
      reset();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Failed to reset password");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm">Set a new password for your account</p>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="space-y-4 text-center">
            <p className="text-green-700">{message}</p>
            <Button onClick={() => navigate("/auth/login")}>Go to Login</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {message && <p className="text-destructive text-sm">{message}</p>}
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                {...register("new_password", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.new_password && <FormErrorMessage message={errors.new_password.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm new password"
                {...register("confirm_new_password", {
                  required: "Please confirm your new password",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.confirm_new_password && (
                <FormErrorMessage message={errors.confirm_new_password.message} />
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Remembered your password?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
