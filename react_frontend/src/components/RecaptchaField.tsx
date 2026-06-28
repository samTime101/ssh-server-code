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
      <div className="recaptcha-field relative isolate z-10 space-y-2 [&_iframe]:pointer-events-auto [&_iframe]:h-[78px] [&_iframe]:w-[304px] [&_iframe]:max-w-none">
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
