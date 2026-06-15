import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/api/providers";
import { WebVitalsReporter } from "@/shared/lib/web-vitals";
import { Header } from "@/widgets/header";
import { MobileTabBar } from "@/widgets/mobile-tab-bar";
import { Footer } from "@/widgets/footer";

const inter = Inter({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display-app",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "runable — 달리자, 나답게.",
    template: "%s · runable",
  },
  description: "대회 접수부터 기록까지 — 러너를 위한 올인원 플랫폼.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <WebVitalsReporter />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
