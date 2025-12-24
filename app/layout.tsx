import Navbar from "./components/layout/Navbar";
import NewsletterModal from "./components/Modals/NewsletterModal";
import "./style/globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-mesh min-h-screen antialiased">
       <Navbar/>
       <NewsletterModal/>
        {children}
      </body>
    </html>
  );
}