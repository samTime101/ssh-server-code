import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import type { ForgotPasswordRequest, LoginRequest } from "@/types/auth";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Modal from "@/components/Modal";
import { requestPasswordResetService } from "@/services/auth";
import { toast } from "sonner";
import RecaptchaField, { type RecaptchaFieldHandle } from "@/components/RecaptchaField";
import { isRecaptchaConfigured } from "@/config/recaptcha";
import { shouldShowLoginCaptcha } from "@/utils/loginAttempts";

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginRecaptchaToken, setLoginRecaptchaToken] = useState<string | null>(null);
  const [loginRecaptchaError, setLoginRecaptchaError] = useState<string>();
  const [showLoginCaptcha, setShowLoginCaptcha] = useState(
    () => isRecaptchaConfigured && shouldShowLoginCaptcha()
  );
  const [forgotRecaptchaToken, setForgotRecaptchaToken] = useState<string | null>(null);
  const [forgotRecaptchaError, setForgotRecaptchaError] = useState<string>();
  const loginRecaptchaRef = useRef<RecaptchaFieldHandle>(null);
  const forgotRecaptchaRef = useRef<RecaptchaFieldHandle>(null);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginRequest>();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<ForgotPasswordRequest>();

  const onSubmit = async (data: LoginRequest) => {
    if (!data.email || !data.password) {
      return;
    }
    if (showLoginCaptcha && !loginRecaptchaToken) {
      setLoginRecaptchaError("Please complete the reCAPTCHA verification.");
      return;
    }
    setLoginRecaptchaError(undefined);
    setLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
        recaptcha: loginRecaptchaToken ?? undefined,
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      const recaptchaError = error.response?.data?.recaptcha;
      if (recaptchaError || shouldShowLoginCaptcha()) {
        setShowLoginCaptcha(true);
      }
      loginRecaptchaRef.current?.reset();
      setLoginRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };
  const onForgotSubmit = async (data: ForgotPasswordRequest) => {
    if (!data.email) {
      return;
    }
    if (isRecaptchaConfigured && !forgotRecaptchaToken) {
      setForgotRecaptchaError("Please complete the reCAPTCHA verification.");
      return;
    }
    setForgotRecaptchaError(undefined);
    setForgotLoading(true);
    try {
      await requestPasswordResetService({
        email: data.email,
        recaptcha: forgotRecaptchaToken ?? undefined,
      });
      toast.success("If the email exists, a reset link has been sent.");
      resetForgot();
      forgotRecaptchaRef.current?.reset();
      setForgotRecaptchaToken(null);
      setForgotOpen(false);
    } catch (error: any) {
      const recaptchaError = error.response?.data?.recaptcha;
      if (recaptchaError) {
        toast.error(Array.isArray(recaptchaError) ? recaptchaError[0] : recaptchaError);
      } else {
        const errorMessage = error.response?.data?.detail || "Failed to send reset link";
        toast.error(errorMessage);
      }
      forgotRecaptchaRef.current?.reset();
      setForgotRecaptchaToken(null);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to sign in to your account
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmitLogin(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              {...registerLogin("email", {
                required: "Email is required",
                setValueAs: (value) => (typeof value === "string" ? value.trim() : value),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {loginErrors.email && <FormErrorMessage message={loginErrors.email.message} />}{" "}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...registerLogin("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {loginErrors.password && <FormErrorMessage message={loginErrors.password.message} />}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={() => setForgotOpen(true)}
            >
              Forgot password?
            </Button>
          </div>
          {showLoginCaptcha && (
            <RecaptchaField
              ref={loginRecaptchaRef}
              onChange={(token) => {
                setLoginRecaptchaToken(token);
                if (token) {
                  setLoginRecaptchaError(undefined);
                }
              }}
              error={loginRecaptchaError}
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
      <Modal open={forgotOpen} onOpenChange={setForgotOpen} title="Reset your password">
        <form className="space-y-4" onSubmit={handleSubmitForgot(onForgotSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              placeholder="Enter your email"
              {...registerForgot("email", {
                required: "Email is required",
                setValueAs: (value) => (typeof value === "string" ? value.trim() : value),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {forgotErrors.email && <FormErrorMessage message={forgotErrors.email.message} />}
          </div>
          {isRecaptchaConfigured && (
            <RecaptchaField
              ref={forgotRecaptchaRef}
              onChange={(token) => {
                setForgotRecaptchaToken(token);
                if (token) {
                  setForgotRecaptchaError(undefined);
                }
              }}
              error={forgotRecaptchaError}
            />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={forgotLoading}>
              {forgotLoading ? "Sending..." : "Send reset link"}
            </Button>
          </div>
        </form>
      </Modal>
    </AuthLayout>
  );
};

export default LoginPage;
