import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "AarogyaNote | Clinical conversation, clearly documented",
  description: "A thoughtful clinical conversation assistant for care teams.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/AarogyaNote_Logo.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "AarogyaNote | Clinical conversation, clearly documented",
    description: "A thoughtful clinical conversation assistant for care teams.",
    images: [{ url: "/AarogyaNote_Logo.png", width: 1317, height: 1317, alt: "AarogyaNote Logo" }],
  },
  twitter: {
    card: "summary",
    title: "AarogyaNote | Clinical conversation, clearly documented",
    description: "A thoughtful clinical conversation assistant for care teams.",
    images: ["/AarogyaNote_Logo.png"],
  },
};

const themeScript = `(() => { try { const saved = localStorage.getItem("aarogyanote-theme"); const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = saved || (systemDark ? "dark" : "light"); } catch { document.documentElement.dataset.theme = "light"; } })();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/AarogyaNote_Logo.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
