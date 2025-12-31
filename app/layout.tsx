import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import NewsletterModal from "./components/Modals/NewsletterModal";
import "./style/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use process.env for security
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
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