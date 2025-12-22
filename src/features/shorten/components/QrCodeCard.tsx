"use client";

import { useEffect, useState } from "react";
import { useShortenStore } from "../store/useShortenStore";
import { generateQRCodeDataURL } from "../../../shared/utils/qr";

export function QrCodeCard() {
  const { shortUrl, status } = useShortenStore();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (status === "success" && shortUrl) {
      setIsGenerating(true);
      generateQRCodeDataURL(shortUrl)
        .then((dataUrl) => {
          setQrDataUrl(dataUrl);
          setIsGenerating(false);
        })
        .catch((error) => {
          console.error("Failed to generate QR code:", error);
          setIsGenerating(false);
        });
    } else {
      setQrDataUrl(null);
    }
  }, [shortUrl, status]);

  if (status !== "success" || !shortUrl) {
    return null;
  }

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
    <div className="w-full max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">QR Code</h3>
      {isGenerating ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Generating QR code...</p>
        </div>
      ) : qrDataUrl ? (
        <div className="space-y-3">
          <div className="flex justify-center">
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="border border-gray-200 rounded"
            />
          </div>
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Download QR Code
          </button>
        </div>
      ) : null}
    </div>
  );
}

