import type { ReactNode } from "react";
import AuthNavbar from "@/components/AuthNavbar";
import { Card } from "@/components/ui/card";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center px-4">
      <AuthNavbar />
      <div className="flex w-full max-w-6xl items-center justify-center gap-10 rounded-lg bg-white p-2 shadow-lg sm:min-h-[76vh] sm:justify-normal">
        <div className="hidden w-full max-w-1/2 self-stretch sm:flex">
          <img
            className="h-full w-full rounded-lg object-cover object-left"
            src="https://static.vecteezy.com/system/resources/previews/020/456/507/original/elegant-medical-background-design-template-new-design-of-medical-background-free-vector.jpg"
            alt="Medical illustration"
          />
        </div>
        <Card className="flex w-full max-w-md flex-col border-none shadow-none md:mt-0">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
