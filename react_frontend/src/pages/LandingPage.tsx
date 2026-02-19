import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
        <p>LandingPage</p>
        <Link to="/auth/signup">
          <Button size="lg" className="mt-8">
            Get Started
          </Button>
        </Link>
    </div>
  );
};

export default LandingPage;
