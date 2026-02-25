// components/Home/Footer.tsx
import { Box, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-xl text-[#2D2E5F]">
              <div className="bg-[#5D5FEF] p-1.5 rounded-lg text-white">
                <Box size={20} />
              </div>
              <span>Wrklyst</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Making file management effortless, secure, and accessible for everyone, everywhere.
            </p>
            <div className="flex gap-4 text-slate-600">
              <Twitter size={20} className="hover:text-[#5D5FEF] cursor-pointer" />
              <Github size={20} className="hover:text-[#5D5FEF] cursor-pointer" />
              <Linkedin size={20} className="hover:text-[#5D5FEF] cursor-pointer" />
            </div>
          </div>

          {/* Tools Links */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6">Popular Tools</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="hover:text-[#5D5FEF] cursor-pointer">Merge PDF</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Image Converter</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Video Compressor</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Document Editor</li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="hover:text-[#5D5FEF] cursor-pointer">About Us</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Pricing</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Careers</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="hover:text-[#5D5FEF] cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Terms of Service</li>
              <li className="hover:text-[#5D5FEF] cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-700 text-xs font-bold uppercase tracking-widest">
          <p>© {currentYear} Wrklyst Inc. All rights reserved.</p>
          <p>Designed for Efficiency</p>
        </div>
      </div>
    </footer>
  );
}