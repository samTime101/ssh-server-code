import { Link } from "react-router-dom";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your information to create your account
        </p>
      </CardHeader>
      <CardContent>
        <SignupForm
          onSuccess={() => {
            navigate("/auth/login");
          }}
          addUser={false}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </AuthLayout>
  );
};

export default SignupPage;
