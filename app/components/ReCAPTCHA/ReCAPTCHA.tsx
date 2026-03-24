"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

interface ReCAPTCHAComponentProps {
  onVerify: (token: string) => void;
  onExpired?: () => void;
}

export default function ReCAPTCHAComponent({
  onVerify,
  onExpired,
}: ReCAPTCHAComponentProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (token: string | null) => {
    if (token) {
      onVerify(token);
    }
  };

  const handleExpired = () => {
    if (onExpired) {
      onExpired();
    }
  };

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        onChange={handleChange}
        onExpired={handleExpired}
        theme="light"
      />
    </div>
  );
}
