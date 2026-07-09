import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/app/components/Toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_NAME = "My Portfolio";
const SITE_DESC =
  "A curated portfolio of video, graphic, and web projects — selected work and case studies.";

export const metadata = {
  // Base URL for resolving OpenGraph/Twitter image paths into absolute URLs.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${SITE_NAME} — Creative Work & Projects`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Creative Work & Projects`,
    description: SITE_DESC,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Creative Work & Projects`,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
