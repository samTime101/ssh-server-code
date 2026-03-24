import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest } from "@/types/auth";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    if (!data.email || !data.password) {
      return;
    }
    setLoading(true);
    // await login({ email: data.email, password: data.password });

    // reset garna ko lagi
    try {
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 relative">
      <div className="absolute top-0 left-0 right-0 flex px-6 py-4 mx-auto z-10" style={{ maxWidth: 1200 }}>
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <polyline
                points="2,15 6,15 9,8 13,20 17,6 20,15 24,15"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <span
              className="text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Vaidix
            </span>
            <span
              className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground"
              style={{ marginTop: -2 }}
            >
              Medical MCQ Platform
            </span>
          </div>
        </Link>
      </div>

      <Card className="w-full max-w-md mt-16 md:mt-0">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <FormErrorMessage message={errors.email.message} />}{" "}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
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
              {errors.password && <FormErrorMessage message={errors.password.message} />}
            </div>
            {/* TODO: Signup ma pani */}
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
      </Card>
    </div>
  );
};

export default LoginPage;
