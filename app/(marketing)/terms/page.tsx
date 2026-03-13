// app/terms/page.tsx

import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";
import LegalLayout from "@/app/components/Legal/LegalLayout";
import {
  ShieldCheck,
  AlertCircle,
  Users,
  Lock,
  FileText,
  Zap,
} from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalLayout
        title="Terms of Service"
        subtitle="Legal Documentation"
        lastUpdated="March 2026"
        version="2.1"
      >
        <TermsContent />
      </LegalLayout>
    </>
  );
}

function TermsContent() {
  const sections = [
    {
      num: "1",
      title: "Acceptance of Terms",
      icon: ShieldCheck,
      content:
        "By accessing or using Wrklyst, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. Your continued use of Wrklyst constitutes acceptance of these terms.",
    },
    {
      num: "2",
      title: "User Data & Privacy",
      icon: Lock,
      content: null,
      list: [
        "Processed in-memory whenever possible",
        "Encrypted during transmission via SSL/HTTPS",
        "Automatically deleted from our servers within 60 minutes",
        "Never sold to third parties",
      ],
    },
    {
      num: "3",
      title: "Disclaimer of Warranties",
      icon: AlertCircle,
      content:
        "Wrklyst is provided 'AS-IS' without warranties of any kind, express or implied. We make no warranty that our services will be uninterrupted, timely, secure, or error-free. Use at your own risk.",
    },
    {
      num: "4",
      title: "Limitation of Liability",
      icon: Zap,
      content:
        "Wrklyst shall not be liable for any damages (including loss of data, revenue, or profits) resulting from the use or inability to use our services, even if we've been notified of such damages.",
    },
    {
      num: "5",
      title: "User Responsibilities",
      icon: Users,
      content: null,
      list: [
        "You are responsible for all content you upload or process",
        "You must have the legal right to process such content",
        "You agree not to violate any laws or infringe on third-party rights",
        "You must not upload malware, viruses, or malicious content",
        "You must not attempt to hack or reverse-engineer our services",
      ],
    },
    {
      num: "6",
      title: "Intellectual Property",
      icon: FileText,
      content:
        "All content on Wrklyst (logos, design, code, etc.) is owned by Wrklyst Inc. and protected by copyright law. You may not reproduce, modify, or distribute any content without permission.",
    },
  ];

  return (
    <>
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <div key={idx} className="mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D5FEF]/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-[#5D5FEF]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
                  {section.num}. {section.title}
                </h2>
                {section.content && (
                  <p className="text-slate-500 leading-relaxed font-medium mb-4">
                    {section.content}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-2 ml-4">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="text-slate-600 font-medium flex items-start gap-3"
                      >
                        <span className="text-[#5D5FEF] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Additional Sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          7. User Accounts
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium mb-4">
          If you create an account:
        </p>
        <ul className="space-y-2 ml-4">
          {[
            "You are responsible for maintaining password confidentiality",
            "You are responsible for all account activity",
            "You must notify us immediately of unauthorized access",
            "You must not share your account with others",
            "You must provide accurate information",
          ].map((item, i) => (
            <li
              key={i}
              className="text-slate-600 font-medium flex items-start gap-3"
            >
              <span className="text-[#5D5FEF] mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          8. Acceptable Use Policy
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium mb-4">
          You agree NOT to:
        </p>
        <ul className="space-y-2 ml-4">
          {[
            "Upload or process malicious software",
            "Attempt unauthorized access to systems",
            "Engage in harassment or threatening behavior",
            "Violate applicable laws or regulations",
            "Infringe on intellectual property rights",
            "Spam or send unsolicited communications",
            "Interfere with service operation",
            "Reverse-engineer or decompile our software",
          ].map((item, i) => (
            <li
              key={i}
              className="text-slate-600 font-medium flex items-start gap-3"
            >
              <span className="text-[#5D5FEF] mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          9. Payments & Refunds
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          All subscription payments are non-refundable except as required by
          law. We may change pricing with 30 days' notice. Subscription
          cancellations can be made anytime through your account settings. You
          retain access until your billing period ends.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          10. Termination
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Wrklyst may terminate or suspend your account immediately, without
          notice, if you violate these Terms of Service or engage in
          inappropriate conduct. Upon termination, your access ceases
          immediately.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          11. Third-Party Links
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Wrklyst may contain links to third-party websites. We are not
          responsible for their content or practices. Your use is at your own
          risk and subject to their terms.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          12. Modifications
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Wrklyst may modify these terms at any time without notice. Changes
          will be posted here with an updated date. Your continued use means
          acceptance of updated terms.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          13. Governing Law
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          These Terms are governed by applicable laws. Any disputes will be
          handled in the appropriate courts of jurisdiction.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          14. Contact Information
        </h2>
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 p-6">
          <p className="text-slate-600 font-medium mb-3">
            Questions about these terms? Contact us:
          </p>
          <div className="space-y-2">
            <p className="text-slate-600 font-medium">📧 support@wrklyst.com</p>
            <p className="text-slate-600 font-medium">🌐 https://wrklyst.com</p>
            <p className="text-slate-600 font-medium">
              💬{" "}
              <a href="/contact" className="text-[#5D5FEF] hover:underline">
                Contact Form
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
        <p className="text-sm text-amber-800 font-medium">
          <strong>Last Updated:</strong> March 13, 2026. These Terms of Service
          are effective as of this date. Changes will be posted with an updated
          date.
        </p>
      </div>
    </>
  );
}
