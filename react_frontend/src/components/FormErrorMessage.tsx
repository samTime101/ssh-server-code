//import React from "react";
import { Info } from "lucide-react";

const FormErrorMessage = ({ message }: { message?: string }) => {
  return (
    <div className="text-destructive mt-1 flex items-center gap-2 text-sm font-medium">
      <Info className="text-destructive h-4 w-4" />
      {message}
    </div>
  );
};

export default FormErrorMessage;
