import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono, Lora } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import { AuthGuard } from "@/components/auth-guard";
import { CookingProgressIndicator } from "@/components/cooking-progress-indicator";
import "./globals.css";

const vietnameseSans = Be_Vietnam_Pro({
  variable: "--font-vietnamese-sans",
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vietnameseSerif = Lora({
  variable: "--font-vietnamese-serif",
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "mise. | Touchless Recipe",
  description: "A quiet kitchen companion for hands-free cooking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${vietnameseSans.variable} ${vietnameseSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><LanguageProvider><AuthGuard>{children}</AuthGuard><CookingProgressIndicator /></LanguageProvider></body>
    </html>
  );
}
