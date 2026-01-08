"use client";
import React, { useEffect, useState } from 'react';
import { Mail, Shield, Trash2, CheckCircle2, XCircle, Search, UserPlus } from 'lucide-react';

export default function AdminUsersPage() {
  // We'll start with mock data so you can see the UI immediately
  const [users, setUsers] = useState([
    { id: 7, username: "gaurav", email: "gaurav@wrklyst.com", is_admin: true, is_verified: true, joined: "2026-01-05" },
    { id: 8, username: "test_user", email: "user@example.com", is_admin: false, is_verified: true, joined: "2026-01-06" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[1000] text-[#0F172A] tracking-tight">USER DIRECTORY</h1>
          <p className="text-slate-500 font-medium">Manage permissions and account status for all members.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          <UserPlus size={18} /> Invite User
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
           </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
              <th className="px-8 py-5">User Details</th>
              <th className="px-8 py-5">Verification</th>
              <th className="px-8 py-5">Access Level</th>
              <th className="px-8 py-5">Join Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 text-[#0F172A] rounded-2xl flex items-center justify-center font-black text-lg border border-slate-200">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{user.username}</p>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {user.is_verified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {user.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-8 py-5">
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.is_admin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.is_admin ? <Shield size={12} /> : <Shield size={12} className="opacity-30" />}
                    {user.is_admin ? 'Admin' : 'Member'}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-400">
                  {user.joined}
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}