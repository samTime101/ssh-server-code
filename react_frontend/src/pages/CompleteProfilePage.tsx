import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchAllColleges } from "@/services/admin/college-service";
import type { College } from "@/types/college";
import type {
  CompleteProfileFormValues,
  CompleteProfileLocationState,
  GoogleSignupPending,
} from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

const CompleteProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { completeGoogleSignup } = useAuth();
  const state = location.state as CompleteProfileLocationState | null;
  const googleSignup: GoogleSignupPending | undefined = state?.googleSignup;

  const [colleges, setColleges] = useState<College[]>([]);
  const [open, setOpen] = useState(false);
  const [collegeValue, setCollegeValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>();

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

  if (!googleSignup?.signupToken || !googleSignup?.profile?.email) {
    return <Navigate to="/auth/login" replace />;
  }

  const { profile, signupToken } = googleSignup;

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const onSubmit = async (data: CompleteProfileFormValues) => {
    setSubmitting(true);
    try {
      await completeGoogleSignup({
        signup_token: signupToken,
        username: data.username,
        phonenumber: data.phonenumber,
        college: data.college,
      });
    } catch (error: any) {
      console.error("Complete profile failed:", error);
      const responseData = error?.response?.data;
      if (responseData && typeof responseData === "object") {
        (["username", "phonenumber", "college"] as const).forEach((field) => {
          const fieldError = responseData[field];
          if (Array.isArray(fieldError) && fieldError[0]) {
            setError(field, { message: fieldError[0] });
          }
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Complete your profile</h1>
        <p className="text-muted-foreground text-sm">
          Finish setting up your account to continue
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} readOnly disabled className="bg-muted" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profile.first_name}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profile.last_name}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Username can only contain letters, numbers, and underscores",
                },
              })}
            />
            {errors.username && <FormErrorMessage message={errors.username.message} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phonenumber">Phone Number</Label>
            <Input
              id="phonenumber"
              type="tel"
              placeholder="Enter your phone number"
              {...register("phonenumber", {
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

          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Popover
              open={open}
              onOpenChange={setOpen}
              {...register("college", { required: "College is required" })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="bg-card w-full justify-between"
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
                                currentValue === collegeValue ? "" : currentValue,
                                { shouldValidate: true }
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

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Back to sign in
          </button>
          {" · "}
          <Link to="/auth/signup" className="text-primary font-medium hover:underline">
            Sign up with email
          </Link>
        </p>
      </CardFooter>
    </AuthLayout>
  );
};

export default CompleteProfilePage;
