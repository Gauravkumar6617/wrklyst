// components/Navbar.tsx
import Link from 'next/link';
import { ChevronDown, Box } from 'lucide-react';

export default function Navbar() {
  return (
    /* 1. The Wrapper: fixed/sticky with padding to push it away from the edges */
    <div className="fixed top-0 left-0 w-full px-4 md:px-10 py-4 z-50 pointer-events-none">
      
      {/* 2. The Floating Bar: pointer-events-auto restores clickability inside the pill */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 font-bold text-xl text-[#5D5FEF] transition-opacity hover:opacity-90">
  <div className="bg-[#5D5FEF]/10 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
    <Box size={22} strokeWidth={2.5} />
  </div>
  <span className="tracking-tighter text-[#2D2E5F]">Wrklyst</span>
</Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[#64748b] font-semibold text-[14px]">
          <Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact</Link>
          <Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link>
          <div className="group relative cursor-pointer py-2">
  {/* The Label */}
  <span className="flex items-center gap-1 group-hover:text-[#5D5FEF] transition-colors">
    Tools <ChevronDown size={14} strokeWidth={3} className="mt-0.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
  </span>
  
  {/* The Dropdown Box 
    1. Added 'pt-4' to the container and 'top-[80%]' to ensure there is NO gap for the mouse to fall through.
    2. Increased width to 'w-[450px]' and added a 2-column grid.
  */}
  <div className="absolute top-[80%] -left-20 hidden group-hover:block w-[450px] pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
    <div className="bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-[28px] border border-slate-100 p-6">
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* Column 1 */}
        <div className="space-y-1">
          <Link href="/tools/pdf/merge" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Merge PDF
          </Link>
          <Link href="/tools/pdf/split" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Split PDF
          </Link>
          <Link href="/tools/pdf/compress" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Compress PDF
          </Link>
          <Link href="/tools/pdf/to-word" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            PDF to Word
          </Link>
        </div>

        {/* Column 2 */}
        <div className="space-y-1">
          <Link href="/tools/image/resize" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Resize Image
          </Link>
          <Link href="/tools/image/crop" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Crop Image
          </Link>
          <Link href="/tools/image/convert" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Convert Image
          </Link>
          <Link href="/tools/image/remove-bg" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
            Remove Background
          </Link>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-4 border-t border-slate-50">
        <Link href="/tools" className="block w-full py-3 text-center text-sm font-black text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white rounded-xl transition-all">
          Explore All 50+ Tools
        </Link>
      </div>
    </div>
  </div>
</div>
          
        
        </div>

        {/* Action Buttons */}
     {/* Action Buttons with Links */}
<div className="flex items-center gap-2">
  <Link href="/login">
    <button className="px-5 py-2 text-[#2D2E5F] font-bold text-sm hover:bg-slate-50 rounded-full transition-all">
      Log in
    </button>
  </Link>
  
  <Link href="/signup">
    <button className="px-6 py-2 bg-[#1E1F4B] text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
      Sign Up
    </button>
  </Link>
</div>
      </nav>
    </div>
  );
}