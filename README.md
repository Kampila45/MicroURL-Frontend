# MicroURL Frontend

A modern, responsive frontend for the MicroURL URL shortener, built with Next.js 16 and Tailwind CSS.

## Features

- 🔗 **Shorten URLs**: Clean, simple interface to create short links.
- ⚡ **Real-time Feedback**: Instant loading states and success animations.
- 📱 **Responsive Design**: Fully responsive UI that works on mobile and desktop.
- 🎨 **Dark Mode**: Built-in dark/light mode toggle.
- 🛡️ **CAPTCHA Protection**: Integrated Cloudflare Turnstile for spam prevention.
- 📊 **QR Codes**: Automatic QR code generation for shortened links.
- 📋 **Easy Copying**: One-click copy to clipboard functionality.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: SVG Icons (Lucide-style)
- **QR Codes**: `qrcode` library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- The [backend API](../README.md) running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the frontend root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here # Optional
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and layout
├── features/            # Feature-based architecture
│   └── shorten/         # URL shortening feature
│       ├── api/         # API calls
│       ├── components/  # Feature-specific components
│       └── store/       # Zustand store
├── shared/              # Shared utilities and components
│   ├── components/      # UI components (Button, Spinner, etc.)
│   ├── hooks/           # Custom hooks
│   └── utils/           # Helper functions
```

