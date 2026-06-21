import { useRef, useState } from "react";
import type { RecaptchaFieldHandle } from "@/components/RecaptchaField";
import { isRecaptchaConfigured } from "@/config/recaptcha";

export const RECAPTCHA_REQUIRED_MESSAGE = "Please complete the verification below.";

export function useRecaptchaGate() {
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string>();
  const recaptchaRef = useRef<RecaptchaFieldHandle>(null);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setRecaptchaError(undefined);
    }
  };

  const requireRecaptcha = (): boolean => {
    if (!isRecaptchaConfigured) {
      return true;
    }
    if (recaptchaToken) {
      setRecaptchaError(undefined);
      return true;
    }
    setShowRecaptcha(true);
    setRecaptchaError(RECAPTCHA_REQUIRED_MESSAGE);
    return false;
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
  };

  const handleRecaptchaApiError = () => {
    setShowRecaptcha(true);
    setRecaptchaError(RECAPTCHA_REQUIRED_MESSAGE);
    resetRecaptcha();
  };

  return {
    showRecaptcha,
    recaptchaToken,
    recaptchaError,
    recaptchaRef,
    handleRecaptchaChange,
    requireRecaptcha,
    resetRecaptcha,
    handleRecaptchaApiError,
  };
}
