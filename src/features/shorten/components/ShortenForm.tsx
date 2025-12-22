"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { useShortenStore } from "../store/useShortenStore";
import {
  CaptchaField,
  type CaptchaFieldRef,
} from "./CaptchaField";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { cn } from "../../../shared/lib/utils";

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const captchaRef = useRef<CaptchaFieldRef>(null);

  const { createShortLink, status, error, reset: resetStore } = useShortenStore();

  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const captchaRequired = captchaSiteKey !== "";

  useEffect(() => {
    if (status === "success" || status === "error") {
      setCaptchaToken(null);
      setCaptchaResetKey((prev) => prev + 1);
    }
  }, [status]);

  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) {
      setUrlError("URL is required");
      return false;
    }

    try {
      const parsed = new URL(inputUrl);
      if (!parsed.protocol || !parsed.host) {
        setUrlError("Invalid URL format");
        return false;
      }
      setUrlError(null);
      return true;
    } catch {
      setUrlError("Invalid URL format");
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      return;
    }

    if (captchaRequired && !captchaToken) {
      setUrlError("Please complete the CAPTCHA");
      return;
    }

    await createShortLink(url, captchaToken || "");
  };

  const handleReset = () => {
    setUrl("");
    setCaptchaToken(null);
    setUrlError(null);
    resetStore();
    setCaptchaResetKey((prev) => prev + 1);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (urlError) {
      validateUrl(newUrl);
    }
  };

  const isSubmitting = status === "loading";
  const hasUrl = url.trim() !== "";
  const canSubmit = hasUrl && !isSubmitting;
  const showForm = status !== "success";

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-md mx-auto space-y-6 transition-all duration-500 ease-out ${
        showForm
          ? "opacity-100 translate-y-0"
          : "opacity-60 translate-y-2 scale-[0.98]"
      }`}
      suppressHydrationWarning
    >
      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-medium text-foreground">
          Enter URL to shorten
        </label>
        <div className="relative">
          <input
            id="url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste your long URL here"
            disabled={isSubmitting}
            autoComplete="off"
            suppressHydrationWarning
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200"
          />
        </div>
        {urlError && (
          <p className="mt-1 text-sm text-destructive">{urlError}</p>
        )}
      </div>

      {captchaRequired && (
        <div>
          <CaptchaField
            ref={captchaRef}
            key={captchaResetKey}
            onToken={(token) => {
              setCaptchaToken(token);
              setUrlError(null);
            }}
            onError={() => {
              setCaptchaToken(null);
            }}
          />
        </div>
      )}

      {error && status === "error" && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-sm transition-all duration-300 ease-out animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-md transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-2 h-[48px]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
            status === "success"
              ? "hover:bg-primary/90 hover:shadow-md cursor-default"
              : "hover:bg-primary/90 hover:shadow-lg"
          )}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating...</span>
            </>
          ) : status === "success" ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Created!</span>
            </>
          ) : (
            "Create Short URL"
          )}
        </button>
        {(status === "success" || status === "error") && (
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-muted/80 border border-border text-foreground rounded-lg font-medium hover:bg-muted hover:border-primary/30 transition-all duration-300 active:scale-[0.98] h-[48px] shadow-sm dark:bg-muted/40 dark:hover:bg-muted/60"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}

