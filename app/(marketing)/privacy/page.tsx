import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";
import LegalLayout from "@/app/components/Legal/LegalLayout";
import PrivacyContent from "@/app/components/Legal/PrivacyContent";

// app/privacy/page.tsx
Navbar
export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <LegalLayout 
        title="Privacy Policy" 
        subtitle="Data Protection" 
        lastUpdated="December 2025" 
        version="1.0"
      >
        <PrivacyContent />
      </LegalLayout>
      <Footer />
    </>
  );
}