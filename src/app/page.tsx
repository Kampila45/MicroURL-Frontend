"use client";

import { ShortenForm, ResultDisplay } from "../features/shorten";
import { ThemeToggle } from "../shared/components/ThemeToggle";
import { Footer } from "../shared/components/Footer";
import { cn } from "../shared/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <ThemeToggle />
      <main
        className={cn(
          "w-full mx-auto flex grow flex-col gap-y-6 px-4",
          "flex items-center justify-center py-8"
        )}
      >
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              MicroURL
            </h1>
            <p className="text-lg text-muted-foreground">
              Create short, shareable links instantly
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <ShortenForm />
            <ResultDisplay />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
