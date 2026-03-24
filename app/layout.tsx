// import { Toaster } from "react-hot-toast";
// import Navbar from "./components/layout/Navbar";
// import NewsletterModal from "./components/Modals/NewsletterModal";
// import "./style/globals.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { Metadata, Viewport } from "next";

// export const metadata: Metadata = {
//   title: "Wrklyst | Empowering Workflows",
//   description:
//     "A comprehensive suite of online utility tools designed to simplify and optimize professional workflows.",
//   metadataBase: new URL("https://wrklyst.com"),
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
//   manifest: "/site.webmanifest",
//   openGraph: {
//     title: "Wrklyst | Professional Utility Tools",
//     description: "Optimize your tasks with high-performance web utilities.",
//     images: ["/og-image.png"],
//     type: "website",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: "#5D5FEF",
//   width: "device-width",
//   initialScale: 1,
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

//   return (
//     <html lang="en">
//       <head>
//         {/* Manual Fallback: This ensures icons work even if Metadata API lags */}
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//         <link rel="manifest" href="/site.webmanifest" />
//       </head>

//       <body className="bg-mesh min-h-screen antialiased selection:bg-indigo-100 selection:text-indigo-700">
//         <GoogleOAuthProvider clientId={googleClientId}>
//           <Navbar />
//           {/* This wrapper is the key: it pushes everything down exactly enough */}
//           <main className="pt-[100px] lg:pt-0 pb-20">{children}</main>
//           <NewsletterModal />
//           <Toaster position="bottom-center" />
//         </GoogleOAuthProvider>
//       </body>
//     </html>
//   );
// }

import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import NewsletterModal from "./components/Modals/NewsletterModal";
import BetaNotification from "./components/layout/BetaNotification";
import GDPRConsent from "./components/layout/GDPRConsent";
import "./style/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata, Viewport } from "next";

// 1. Import your custom Context Providers
import { AuthProvider } from "@/app/context/AuthProvider";
import { HistoryProvider } from "@/app/context/HistoryContext";

// ... (metadata and viewport exports stay the same)
export const metadata: Metadata = {
  title: "Wrklyst | Free Online PDF & Text Tools | Professional Utilities",
  description:
    "Wrklyst offers 50+ free online tools for PDF conversion, text processing, and file management. Convert Word to PDF, merge PDFs, extract tables, and more—all in your browser, 100% private & secure.",
  keywords:
    "pdf tools, pdf converter, online tools, text tools, free utilities, document converter, pdf merger, pdf splitter",
  metadataBase: new URL("https://wrklyst.com"),
  alternates: {
    canonical: "https://wrklyst.com",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Wrklyst | 50+ Free Professional Online Tools",
    description:
      "Convert PDFs, merge documents, extract data, and process files instantly. 100% private, browser-based, no sign-up required.",
    url: "https://wrklyst.com",
    siteName: "Wrklyst",
    images: [
      {
        url: "https://wrklyst.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wrklyst - Professional Online Utilities",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrklyst | Free Professional Online Tools",
    description:
      "50+ tools for PDF conversion, document processing, and file utilities.",
    images: ["https://wrklyst.com/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wrklyst",
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1786398187211222"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="bg-mesh min-h-screen antialiased">
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* 2. Wrap children with Auth and History providers */}
          <AuthProvider>
            <HistoryProvider>
              <Navbar />
              <main className="pt-[100px] lg:pt-0 pb-20">{children}</main>
              <NewsletterModal />
              <BetaNotification />
              <GDPRConsent />
              <Toaster position="bottom-center" />
            </HistoryProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
