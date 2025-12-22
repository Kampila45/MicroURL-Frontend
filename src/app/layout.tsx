import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "../shared/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MicroURL",
  description: "Create short, shareable links instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-background text-foreground scheme-light-dark"
    >
      <body
        className={cn(
          "flex h-fit min-h-screen flex-col gap-y-6 font-sans",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const initialTheme = theme || (prefersDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', initialTheme);
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
