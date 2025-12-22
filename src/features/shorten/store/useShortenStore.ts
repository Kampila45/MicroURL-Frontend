import { create } from "zustand";
import { createShortLink, CreateShortLinkResponse } from "../api/createShortLink";

type Status = "idle" | "loading" | "success" | "error";

interface ShortenState {
  status: Status;
  originalUrl: string | null;
  slug: string | null;
  shortUrl: string | null;
  error: string | null;
  createShortLink: (url: string, captchaToken: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  status: "idle" as Status,
  originalUrl: null,
  slug: null,
  shortUrl: null,
  error: null,
};

export const useShortenStore = create<ShortenState>((set) => ({
  ...initialState,
  createShortLink: async (url: string, captchaToken: string) => {
    set({ status: "loading", error: null });
    
    const startTime = Date.now();
    const minLoadingTime = 800;

    try {
      const response: CreateShortLinkResponse = await createShortLink({
        url,
        captchaToken,
      });

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      set({
        status: "success",
        originalUrl: response.original_url,
        slug: response.slug,
        shortUrl: response.short_url,
        error: null,
      });
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({
        status: "error",
        error: errorMessage,
        originalUrl: null,
        slug: null,
        shortUrl: null,
      });
    }
  },
  reset: () => {
    set(initialState);
  },
}));

