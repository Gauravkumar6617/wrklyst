"use client";

import { useEffect, useState } from 'react';
import { Mail, Calendar, Loader2, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 5;

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const skip = page * limit;
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/admin/get-all-subscriber?skip=${skip}&limit=${limit}`, 
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubs(data);
      }
    } catch (error) {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [page]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-[#5D5FEF]" size={40} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1F4B]">Newsletter Audience</h1>
          <p className="text-slate-400 text-sm">Manage your email marketing list</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-2xl text-xs font-bold text-[#5D5FEF] flex items-center gap-2">
          <UserPlus size={14} /> {subs.length} Active Subs
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <th className="p-5">Email Address</th>
              <th className="p-5">Subscription Date</th>
              <th className="p-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subs.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                      <Mail size={16} />
                    </div>
                    <span className="font-medium text-slate-700">{sub.email}</span>
                  </div>
                </td>
                <td className="p-5 text-sm text-slate-500 flex items-center gap-2">
                  <Calendar size={14} /> {new Date(sub.created_at).toLocaleDateString()}
                </td>
                <td className="p-5 text-right">
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between p-6 bg-slate-50/30 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-bold uppercase">Page {page + 1}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 border rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={subs.length < limit}
              className="p-2 border rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}