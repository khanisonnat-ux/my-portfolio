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

const SITE_NAME = "Khanison Portfolio";
const SITE_DESC = "UX/UI Designer Portfolio";

// Canonical site URL. Prefer the env var (set on Vercel); fall back to the real
// production domain so OG tags are never wrong even if the env var is missing.
// .trim() guards against stray whitespace / hidden characters in the env value.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-9sms-sigma.vercel.app"
).trim();

export const metadata = {
  // Base URL for resolving OpenGraph/Twitter image + url paths into absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_US",
    // og:image is supplied automatically by app/opengraph-image.js.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
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
