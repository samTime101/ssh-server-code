import { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY, isRecaptchaConfigured } from "@/config/recaptcha";
import FormErrorMessage from "@/components/FormErrorMessage";

export interface RecaptchaFieldHandle {
  reset: () => void;
}

interface RecaptchaFieldProps {
  onChange: (token: string | null) => void;
  error?: string;
}

const RecaptchaField = forwardRef<RecaptchaFieldHandle, RecaptchaFieldProps>(
  ({ onChange, error }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
        onChange(null);
      },
    }));

    if (!isRecaptchaConfigured) {
      return null;
    }

    return (
      <div className="space-y-2">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onChange}
          onExpired={() => onChange(null)}
        />
        {error && <FormErrorMessage message={error} />}
      </div>
    );
  }
);

RecaptchaField.displayName = "RecaptchaField";

export default RecaptchaField;
