"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface CaptchaFieldProps {
  onToken: (token: string) => void;
  onError?: (error: Error) => void;
  resetKey?: number;
}

export interface CaptchaFieldRef {
  reset: () => void;
}

export const CaptchaField = forwardRef<CaptchaFieldRef, CaptchaFieldProps>(
  ({ onToken, onError, resetKey }, ref) => {
    const turnstileRef = useRef<TurnstileInstance>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
      },
    }));

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

    if (!siteKey) {
      return null;
    }

    return (
      <Turnstile
        ref={turnstileRef}
        key={resetKey}
        siteKey={siteKey}
        onSuccess={onToken}
        onError={(error) => {
          if (onError) {
            onError(new Error(error));
          }
        }}
        onExpire={() => {
          turnstileRef.current?.reset();
        }}
      />
    );
  }
);

CaptchaField.displayName = "CaptchaField";

