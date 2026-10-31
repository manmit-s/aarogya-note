import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "AarogyaNote | Clinical conversation, clearly documented",
  description: "A thoughtful clinical conversation assistant for care teams."
};

const themeScript = `(() => { try { const saved = localStorage.getItem("aarogyanote-theme"); const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = saved || (systemDark ? "dark" : "light"); } catch { document.documentElement.dataset.theme = "light"; } })();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body suppressHydrationWarning><SmoothScroll />{children}</body></html>;
}

