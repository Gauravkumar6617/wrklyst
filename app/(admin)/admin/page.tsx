"use client";

import { useEffect, useState } from 'react';
// ADDED Chevron imports here
import { Trash2, ShieldCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); 
  const limit = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true); // Ensure loading shows on page change
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("No token found. Please login.");
        return;
      }
      
      // CALCULATE SKIP: page 0 = skip 0, page 1 = skip 5
      const skip = page * limit;
  
      // UPDATED URL: Added skip and limit parameters
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/admin/get-all-users?skip=${skip}&limit=${limit}`, {
        method: 'GET',
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        }
      });
      
      if (res.status === 401) {
        toast.error("Your session expired.");
        return;
      }

      const data = await res.json();
      
      // LOGIC CHECK: 
      // If your backend returns a list: [user1, user2]
      if (Array.isArray(data)) {
        setUsers(data);
      } 
      // If your backend returns an object: { "users": [...], "total": 10 }
      else if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Optimistic UI update: Remove user from state immediately
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Could not delete user");
      }
    } catch (error) {
      toast.error("Network error. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#5D5FEF]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1E1F4B]">User Management</h1>
        <div className="bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <th className="p-5">User Profile</th>
              <th className="p-5">Status / Role</th>
              <th className="p-5">Registration Date</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{user.username}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#5D5FEF] font-bold text-[10px] uppercase">
                        <ShieldCheck size={12} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] uppercase">
                        User
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-xs text-slate-500 font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "N/A"}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 font-medium">
                  No users found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-6 border-t border-slate-50 bg-slate-50/30">
           <p className="text-sm text-slate-500 font-medium">
             Page <span className="text-[#5D5FEF]">{page + 1}</span>
           </p>
           <div className="flex gap-3">
             <button
               onClick={() => setPage((p) => Math.max(0, p - 1))}
               disabled={page === 0}
               className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-30 transition-all"
             >
               <ChevronLeft size={16} /> Previous
             </button>
             <button
               onClick={() => setPage((p) => p + 1)}
               disabled={users.length < limit}
               className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-30 transition-all"
             >
               Next <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </div>
    
    </div>
  );
}