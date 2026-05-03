import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <><Navbar />
    <div className="bg-background flex min-h-screen items-center justify-center px-4 relative">
      {/* <div className="absolute top-0 left-0 right-0 flex px-6 py-4 mx-auto z-10" style={{ maxWidth: 1200 }}>
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
    </div> */}

      <Card className="w-full max-w-md mt-16 md:mt-0">
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
            } }
            addUser={false} />
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
    </div></>
  );
};

export default SignupPage;