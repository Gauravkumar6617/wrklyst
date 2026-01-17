import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import NewsletterModal from "./components/Modals/NewsletterModal";
import "./style/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Wrklyst | Empowering Workflows",
  description:
    "A comprehensive suite of online utility tools designed to simplify and optimize professional workflows.",
  metadataBase: new URL("https://wrklyst.com"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Wrklyst | Professional Utility Tools",
    description: "Optimize your tasks with high-performance web utilities.",
    images: ["/og-image.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5D5FEF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      <head>
        {/* Manual Fallback: This ensures icons work even if Metadata API lags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-mesh min-h-screen antialiased">
        <GoogleOAuthProvider clientId={googleClientId}>
          <Navbar />
          <NewsletterModal />
          <Toaster position="bottom-center" />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

