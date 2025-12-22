"use client";

import { useState } from "react";
import { useShortenStore } from "../store/useShortenStore";

export function ResultCard() {
  const { shortUrl, status } = useShortenStore();
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Your short URL:
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={shortUrl}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

