import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmailService } from "@/services/auth";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EmailVerified = () => {
  const { token } = useParams<{ token?: string }>();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Invalid verification link");
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyEmailService(token);
        setMessage(response.data.detail);
        setIsSuccess(true);
      } catch (error: any) {
        console.error("Email verification failed:", error);
        setMessage(error.response?.data?.detail || "Verification failed");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-2xl font-bold">Email Verification</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {isLoading ? (
              <>
                <Loader2 className="text-primary h-16 w-16 animate-spin" />
                <p className="text-muted-foreground text-center">Verifying your email...</p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-center font-medium text-green-700">{message}</p>
                <Button onClick={() => navigate("/auth/login")}>
                  Go to Login
                </Button>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-center font-medium text-red-700">{message}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;
