// components/Legal/PrivacyContent.tsx
import {
  Lock,
  EyeOff,
  Trash2,
  ShieldCheck,
  Mail,
  Globe,
  Trash,
  Eye,
  Download,
} from "lucide-react";

export default function PrivacyContent() {
  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4 text-center lg:text-left">
          Our Commitment to Privacy
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          At Wrklyst, we believe your data belongs to you. Our business model is
          built on providing high-quality tools, not on harvesting user data. We
          do not track your individual file contents or sell your information to
          third parties.
        </p>
      </div>

      {/* --- KEY DATA PILLARS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <Lock className="text-purple-500" />,
            title: "Fully Encrypted",
            desc: "All transfers use 256-bit SSL encryption.",
          },
          {
            icon: <EyeOff className="text-blue-500" />,
            title: "No Human Eyes",
            desc: "Processes are automated; no one views your files.",
          },
          {
            icon: <Trash2 className="text-emerald-500" />,
            title: "Auto-Deletion",
            desc: "Files vanish from our servers after 60 minutes.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-[#F8FAFC] rounded-[32px] border border-slate-100 text-center flex flex-col items-center group hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-3 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h4 className="font-bold text-[#2D2E5F] text-sm mb-1">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          Information We Collect
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium mb-4">
          We collect minimal information required to provide our services:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <Mail className="w-6 h-6 text-[#5D5FEF] shrink-0 mt-1" />
            <div>
              <strong className="text-[#2D2E5F] block mb-1">
                Email Addresses
              </strong>
              <span className="text-slate-600 text-sm">
                Collected when you sign up for newsletters, create accounts, or
                contact us. Used only for communication and service updates.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <Eye className="w-6 h-6 text-[#5D5FEF] shrink-0 mt-1" />
            <div>
              <strong className="text-[#2D2E5F] block mb-1">
                Usage Metadata
              </strong>
              <span className="text-slate-600 text-sm">
                We track success rates and tool performance. We do NOT track
                file content or personal data processing.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <Download className="w-6 h-6 text-[#5D5FEF] shrink-0 mt-1" />
            <div>
              <strong className="text-[#2D2E5F] block mb-1">
                Feedback & Support
              </strong>
              <span className="text-slate-600 text-sm">
                When you submit feedback or contact support, we store your
                message to help improve Wrklyst and respond to your requests.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <Globe className="w-6 h-6 text-[#5D5FEF] shrink-0 mt-1" />
            <div>
              <strong className="text-[#2D2E5F] block mb-1">
                Technical Data
              </strong>
              <span className="text-slate-600 text-sm">
                IP address, browser type, device info (for analytics only). This
                data is anonymized and never linked to your identity.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          How We Use Your Data
        </h2>
        <div className="space-y-3">
          {[
            "Sending weekly productivity tips and service updates via email",
            "Improving our tools and identifying performance issues",
            "Understanding user behavior through anonymized analytics",
            "Providing customer support and responding to feedback",
            "Protecting against fraud and unauthorized access",
            "Complying with legal obligations",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-[#5D5FEF] font-bold mt-1">✓</span>
              <span className="text-slate-600 font-medium">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-500 leading-relaxed font-medium mt-6">
          <strong className="text-[#2D2E5F]">We NEVER:</strong> Sell, share, or
          distribute your personal data to third parties for marketing or
          profit.
        </p>
      </div>

      <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 mb-12">
        <h2 className="text-xl font-black text-[#1E1F4B] mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-[#5D5FEF]" /> Data Storage &
          Security
        </h2>
        <div className="space-y-3 text-sm text-slate-700 font-medium">
          <p>
            • Emails and feedback stored in encrypted databases on secure
            servers
          </p>
          <p>
            • File conversions happen entirely in your browser—never stored on
            our servers
          </p>
          <p>• All data transmission uses HTTPS encryption (TLS 1.3)</p>
          <p>• Regular security audits and compliance checks</p>
          <p>• Access limited to authorized personnel only</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          Your Rights & Data Deletion
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-[#2D2E5F] mb-2">
              Unsubscribe from Emails
            </h3>
            <p className="text-slate-600 text-sm">
              Click the unsubscribe link in any newsletter email to immediately
              opt out.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-[#2D2E5F] mb-2">Account Deletion</h3>
            <p className="text-slate-600 text-sm">
              Request deletion of your account and associated data at
              info@wrklyst.com. We'll process it within 30 days.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-[#2D2E5F] mb-2">Data Access</h3>
            <p className="text-slate-600 text-sm">
              Request a copy of your personal data anytime. We'll provide it in
              a readable format within 30 days.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-[#2D2E5F] mb-2">
              Local Browser Data
            </h3>
            <p className="text-slate-600 text-sm">
              Data processed in your browser is never transmitted to our
              servers. Clear your browser cache to delete it.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          Third-Party Services
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="font-bold text-[#2D2E5F] mb-1">Google Analytics</p>
            <p className="text-slate-600 text-sm">
              Tracks anonymized usage patterns. They have their own privacy
              policy.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="font-bold text-[#2D2E5F] mb-1">Email Providers</p>
            <p className="text-slate-600 text-sm">
              We use trusted email services to deliver newsletters. Your email
              is stored securely.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="font-bold text-[#2D2E5F] mb-1">Cloud Hosting (AWS)</p>
            <p className="text-slate-600 text-sm">
              Secure server infrastructure. AWS complies with ISO 27001 and SOC
              2 standards.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          Cookies & Tracking
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium mb-4">
          Wrklyst uses minimal tracking. We do not use cookies for advertising
          or invasive tracking. Your file processing happens entirely in your
          browser—we do not track file contents.
        </p>
        <p className="text-slate-500 leading-relaxed font-medium">
          If you disable cookies, Wrklyst will still function normally. We
          respect your privacy preferences.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          GDPR & International Compliance
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium mb-4">
          If you're in the EU or subject to GDPR, you have the right to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Access your personal data",
            "Correct inaccurate data",
            "Request deletion of your data",
            "Opt-out of marketing",
            "Data portability",
            "Withdraw consent anytime",
          ].map((right, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <span className="text-[#5D5FEF] font-bold">✓</span>
              <span className="text-slate-600 font-medium">{right}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-500 leading-relaxed font-medium mt-6">
          Contact us at info@wrklyst.com to exercise these rights.
        </p>
      </div>

      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 mb-12">
        <h2 className="text-lg font-black text-blue-900 mb-3">
          Children's Privacy
        </h2>
        <p className="text-sm text-blue-800 font-medium">
          Wrklyst is intended for users 18 years and older. We do not knowingly
          collect information from children under 13. If we discover such data,
          we will delete it immediately.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">
          Changes to This Policy
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          We may update this privacy policy periodically. We will notify you of
          significant changes via email or by posting a notice on our website.
          Your continued use of Wrklyst after changes constitutes acceptance of
          the updated policy.
        </p>
      </div>

      <div className="p-8 bg-slate-900 rounded-3xl border border-slate-700 text-white mb-12">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Mail className="text-blue-400" /> Questions or Concerns?
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          If you have questions about this privacy policy or our practices,
          please contact us:
        </p>
        <div className="space-y-2">
          <p className="text-slate-400">
            📧 Email:{" "}
            <a
              href="mailto:info@wrklyst.com"
              className="text-blue-400 hover:text-blue-300"
            >
              info@wrklyst.com
            </a>
          </p>
          <p className="text-slate-400">
            🌐 Website:{" "}
            <a
              href="https://wrklyst.com"
              className="text-blue-400 hover:text-blue-300"
            >
              https://wrklyst.com
            </a>
          </p>
          <p className="text-slate-400">
            💬 Contact:{" "}
            <a href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact Form
            </a>
          </p>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
        <p className="text-sm text-amber-800 font-medium">
          <strong>Last Updated:</strong> March 13, 2026. This privacy policy is
          effective as of this date. Check back regularly for updates.
        </p>
      </div>
    </>
  );
}
