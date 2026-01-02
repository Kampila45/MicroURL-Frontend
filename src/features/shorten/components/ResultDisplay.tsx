"use client";

import { useState, useEffect } from "react";
import { useShortenStore } from "../store/useShortenStore";
import { generateQRCodeDataURL } from "../../../shared/utils/qr";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

type DisplayMode = "link" | "qr";

export function ResultDisplay() {
  const { shortUrl, status } = useShortenStore();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("link");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setQrDataUrl(null);
  }, [shortUrl]);

  useEffect(() => {
    if (status === "success" && shortUrl && displayMode === "qr") {
      if (!qrDataUrl) {
      setIsGenerating(true);
        const minDelay = new Promise((resolve) => setTimeout(resolve, 800));
        const generate = generateQRCodeDataURL(shortUrl);

        Promise.all([generate, minDelay])
          .then(([dataUrl]) => {
          setQrDataUrl(dataUrl);
          setIsGenerating(false);
        })
        .catch((error) => {
          console.error("Failed to generate QR code:", error);
          setIsGenerating(false);
        });
      } else {
        setIsGenerating(false);
      }
    } else if (displayMode !== "qr") {
      setIsGenerating(false);
    }
  }, [shortUrl, status, displayMode, qrDataUrl]);

  useEffect(() => {
    if (status === "success" && shortUrl) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [status, shortUrl]);

  if (status !== "success" || !shortUrl) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-code-${shortUrl.split("/").pop() || "short-url"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 sm:p-6 bg-background border border-border rounded-2xl shadow-lg transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setDisplayMode("link")}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            displayMode === "link"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Short Link
        </button>
        <button
          onClick={() => {
            setDisplayMode("qr");
            if (!qrDataUrl) setIsGenerating(true);
          }}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            displayMode === "qr"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          QR Code
        </button>
      </div>

      {displayMode === "link" ? (
        <div className="space-y-3 transition-all duration-500 ease-out">
          <h3 className="text-sm font-medium text-foreground">
            Your short URL:
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border rounded-lg bg-muted text-foreground text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 min-w-0"
            />
            <button
              onClick={handleCopy}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] whitespace-nowrap flex-shrink-0 ${
                copied
                  ? "bg-green-600 hover:bg-green-700 scale-105"
                  : ""
              }`}
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Copied!
                </span>
              ) : (
                "Copy"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">QR Code</h3>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground text-sm">Generating QR code...</p>
            </div>
          ) : qrDataUrl ? (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-muted rounded-xl">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="border-2 border-border rounded-lg shadow-md"
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                Download QR Code
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

