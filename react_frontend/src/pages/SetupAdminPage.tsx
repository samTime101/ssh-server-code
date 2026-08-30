import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FormErrorMessage from "@/components/FormErrorMessage";
import AuthLayout from "@/layouts/AuthLayout";
import { useSetupAdmin } from "@/hooks/useSetupAdmin";
import { Eye, EyeOff } from "lucide-react";

const SetupAdminPage = () => {
  const {
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
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    password,
    goToLogin,
  } = useSetupAdmin();

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Set up admin account</h1>
        <p className="text-muted-foreground text-sm">
          Complete your organization administrator account
        </p>
      </CardHeader>
      <CardContent>
        {!token ? (
          <p className="text-destructive text-sm">This setup link is missing a token.</p>
        ) : isSuccess ? (
          <div className="space-y-4 text-center">
            <p className="text-green-700">{message}</p>
            <Button onClick={goToLogin}>Go to Login</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isOnPlatformHost && (
              <p className="text-destructive text-sm">
                You are on {currentHost}. Open the email link on the organization subdomain (for
                example acme.localhost) or setup will fail.
              </p>
            )}
            {message && <p className="text-destructive text-sm">{message}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  placeholder="First name"
                  disabled={isOnPlatformHost}
                  {...register("first_name", { required: "First name is required" })}
                />
                {errors.first_name && <FormErrorMessage message={errors.first_name.message} />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  placeholder="Last name"
                  disabled={isOnPlatformHost}
                  {...register("last_name", { required: "Last name is required" })}
                />
                {errors.last_name && <FormErrorMessage message={errors.last_name.message} />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenumber">Phone number</Label>
              <Input
                id="phonenumber"
                type="tel"
                placeholder="10-digit phone number"
                disabled={isOnPlatformHost}
                {...register("phonenumber", {
                  required: "Phone number is required",
                  minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                  maxLength: { value: 10, message: "Phone number must be at most 10 digits" },
                })}
              />
              {errors.phonenumber && <FormErrorMessage message={errors.phonenumber.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  disabled={isOnPlatformHost}
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
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  disabled={isOnPlatformHost}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirm_password && (
                <FormErrorMessage message={errors.confirm_password.message} />
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isOnPlatformHost}>
              {isLoading ? "Setting up..." : "Create admin account"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Already set up?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </AuthLayout>
  );
};

export default SetupAdminPage;
