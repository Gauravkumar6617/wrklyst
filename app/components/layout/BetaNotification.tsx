"use client";

import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function BetaNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user dismissed notification
    const isDismissed = localStorage.getItem("betaNotificationDismissed");
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("betaNotificationDismissed", "true");
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border-2 border-[#5D5FEF] rounded-xl shadow-lg p-4 relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex gap-3 pr-6">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle size={20} className="text-[#5D5FEF]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#2D2E5F] text-sm mb-1">
              We're Building Something Great 🚀
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              We're new and still improving the website. If you face any issues
              or have feedback, let us know at{" "}
              <a
                href="mailto:info@wrklyst.com"
                className="font-semibold text-[#5D5FEF] hover:underline"
              >
                info@wrklyst.com
              </a>
            </p>
            <div className="flex gap-2">
              <a
                href="/contact"
                className="text-xs font-bold text-[#5D5FEF] hover:text-[#4D4FDF] transition-colors"
              >
                Send Feedback
              </a>
              <button
                onClick={handleDismiss}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors ml-auto"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5D5FEF] to-transparent rounded-b-[9px]" />
      </div>
    </div>
  );
}
