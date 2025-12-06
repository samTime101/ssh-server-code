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
import { fetchColleges } from "@/services/admin/college-service";
import type { College } from "@/types/college";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SignupPage = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [open, setOpen] = useState(false);
  const [collegeValue, setCollegeValue] = useState("");

  useEffect(() => {
    async function getColleges(){
      try {
        const data = await fetchColleges();
        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    }
    getColleges()
  }, [])

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
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      phonenumber: data.phonenumber,
      college: data.college
    });
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
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
                })}
              />
              {errors.phonenumber && <FormErrorMessage message={errors.phonenumber.message} />}
            </div>

            {/* Password */}
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

            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {collegeValue
                      ? colleges.find((college) => college.name === collegeValue)?.name
                      : "Select college"}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search college..." />
                    <CommandEmpty>No college found.</CommandEmpty>
                    <CommandGroup>
                      {colleges.map((college) => (
                        <CommandItem
                          key={college.id}
                          value={college.name}
                          onSelect={(currentValue) => {
                            setCollegeValue(currentValue === collegeValue ? "" : currentValue);
                            setValue("college", currentValue === collegeValue ? "" : currentValue);
                            setOpen(false);
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