import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import type { SignupRequest } from "@/types/auth";
import FormErrorMessage from "@/components/FormErrorMessage";
import { fetchAllColleges } from "@/services/admin/college-service";
import type { College } from "@/types/college";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SignupPage = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [open, setOpen] = useState(false);
  const [collegeValue, setCollegeValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function getColleges() {
      try {
        const data = await fetchAllColleges();
        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    }
    getColleges();
  }, []);

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupRequest>();

  const onSubmit = async (data: SignupRequest) => {
    if (
      !data.email ||
      !data.password ||
      !data.confirm_password ||
      !data.username ||
      !data.first_name ||
      !data.last_name ||
      !data.phonenumber ||
      !data.college
    ) {
      return;
    }
    setLoading(true);
    try {
      await register({
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        phonenumber: data.phonenumber,
        college: data.college,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your information to create your account
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Enter your first name"
                  {...formRegister("first_name", { required: "First name is required" })}
                />
                {errors.first_name && <FormErrorMessage message={errors.first_name.message} />}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Enter your last name"
                  {...formRegister("last_name", { required: "Last name is required" })}
                />
                {errors.last_name && <FormErrorMessage message={errors.last_name.message} />}
              </div>
            </div>

            {/* Username */}
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

            {/* Email */}
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

            {/* Phone Number */}
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
                  maxLength: { value: 10, message: "Phone number must be at most 10 digits" },
                })}
              />
              {errors.phonenumber && <FormErrorMessage message={errors.phonenumber.message} />}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...formRegister("password", {
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...formRegister("confirm_password", {
                    required: "Confirm password is required",
                    validate: (value, formValues) =>
                      value === formValues.password || "Passwords do not match",
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

            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Popover
                open={open}
                onOpenChange={setOpen}
                {...formRegister("college", { required: "College is required" })}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {collegeValue || "Select college"}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search college..."
                      value={searchInput}
                      onValueChange={setSearchInput}
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {searchInput.length < 3 ? (
                        <div className="text-muted-foreground p-4 text-center text-sm">
                          Type at least 3 letters to search
                        </div>
                      ) : filteredColleges.length === 0 ? (
                        <div className="text-muted-foreground p-4 text-center text-sm">
                          No college found
                        </div>
                      ) : (
                        <CommandGroup>
                          {filteredColleges.map((college) => (
                            <CommandItem
                              key={college.id}
                              value={college.name}
                              onSelect={(currentValue) => {
                                setCollegeValue(currentValue === collegeValue ? "" : currentValue);
                                setValue(
                                  "college",
                                  currentValue === collegeValue ? "" : currentValue
                                );
                                setOpen(false);
                                setSearchInput("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  collegeValue === college.name ? "opacity-100" : "opacity-20"
                                )}
                              />
                              {college.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.college && <FormErrorMessage message={errors.college.message} />}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
