"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto text-center text-sm text-muted-foreground border-t border-border bg-muted/30">
      <p>© {currentYear} MicroURL. All rights reserved.</p>
    </footer>
  );
}

