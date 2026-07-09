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

export const metadata = {
  // Base URL for resolving OpenGraph/Twitter image + url paths into absolute
  // URLs. Set NEXT_PUBLIC_SITE_URL to your deployed domain in production.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
    // Resolves against metadataBase → your site's root URL (og:url).
    url: "/",
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
