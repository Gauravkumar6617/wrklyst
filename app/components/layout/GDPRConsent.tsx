"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function GDPRConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("gdpr-consent");
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("gdpr-consent", "accepted");
    localStorage.setItem("gdpr-consent-date", new Date().toISOString());
    setShowConsent(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("gdpr-consent", "rejected");
    localStorage.setItem("gdpr-consent-date", new Date().toISOString());
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background Overlay */}
      <div
        className="bg-black/40 backdrop-blur-sm absolute inset-0"
        onClick={handleRejectAll}
      />

      {/* Consent Banner */}
      <div className="relative bg-white border-t border-slate-200 p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1E1F4B] mb-2">
              🍪 We Use Cookies & Advertising Technologies
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              We use cookies, web beacons, and similar tracking technologies to
              enhance your experience and show personalized ads through Google
              AdSense. This helps us provide free services and improve our
              platform. By continuing to use this site, you consent to our use
              of cookies and advertising partners' data collection practices as
              outlined in our{" "}
              <Link
                href="/privacy"
                className="text-[#5D5FEF] font-semibold hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-[#5D5FEF] font-semibold hover:underline"
              >
                Terms of Service
              </Link>
              .
            </p>

            <details className="text-xs text-slate-600 mt-2">
              <summary className="cursor-pointer font-semibold text-slate-700 hover:text-[#5D5FEF]">
                More Information
              </summary>
              <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                <li>
                  Google AdSense may show personalized ads based on your
                  interests
                </li>
                <li>We use analytics to understand how you use our site</li>
                <li>
                  You can manage your preferences in your browser settings
                </li>
                <li>
                  Essential cookies are always used for site functionality
                </li>
              </ul>
            </details>
          </div>

          <button
            onClick={handleRejectAll}
            className="self-start sm:self-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:ml-0">
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-6 py-3 bg-[#5D5FEF] text-white rounded-lg font-bold text-sm hover:bg-[#4D4FDF] transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
