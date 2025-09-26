import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import type { SignupRequest } from "@/types/auth";
import FormErrorMessage from "@/components/FormErrorMessage";

const SignupPage = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupRequest>();

  const onSubmit = (data: SignupRequest) => {
    if (
      !data.email ||
      !data.password ||
      !data.username ||
      !data.firstname ||
      !data.lastname ||
      !data.phonenumber
    ) {
      return;
    }
    setLoading(true);
    register({
      email: data.email,
      password: data.password,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      phonenumber: data.phonenumber,
    });
    // TODO: Remove this timeout and handle loading state based on actual signup response
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create your account
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="Enter your first name"
                  {...formRegister("firstname", { required: "First name is required" })}
                />
                {errors.firstname && <FormErrorMessage message={errors.firstname.message} />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Enter your last name"
                  {...formRegister("lastname", { required: "Last name is required" })}
                />
                {errors.lastname && <FormErrorMessage message={errors.lastname.message} />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...formRegister("username", { required: "Username is required" })}
              />
              {errors.username && <FormErrorMessage message={errors.username.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <FormErrorMessage message={errors.email.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenumber">Phone Number</Label>
              <Input
                id="phonenumber"
                type="tel"
                placeholder="Enter your phone number"
                {...formRegister("phonenumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Invalid phone number",
                  },
                  minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                })}
              />
              {errors.phonenumber && <FormErrorMessage message={errors.phonenumber.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && <FormErrorMessage message={errors.password.message} />}
            </div>
            <Button type="submit" className="w-full">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
