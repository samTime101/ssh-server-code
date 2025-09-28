//import React from "react";
import { Info } from "lucide-react";

const FormErrorMessage = ({ message }: { message?: string }) => {
  return (
    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-red-600">
      <Info className="h-4 w-4 text-red-500" />
      {message}
    </div>
  );
};

export default FormErrorMessage;
