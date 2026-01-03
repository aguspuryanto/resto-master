
import React from 'react';
import { User, UserRole, UserStatus } from '../types';
import { Check, X, Shield, User as UserIcon, MoreHorizontal } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onApprove: (userId: string, role: UserRole) => void;
  onReject: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onApprove, onReject }) => {
  const pendingUsers = users.filter(u => u.status === UserStatus.PENDING);
  const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);

  return (
    <div className="space-y-8 pb-10">
      {/* Pending Approvals Section */}
      {pendingUsers.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            Persetujuan Staff Baru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingUsers.map(user => (
              <div key={user.id} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <UserIcon size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-800 truncate text-sm sm:text-base">{user.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Tgl Daftar</p>
                  <p className="text-xs font-bold text-slate-700">{user.joinedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onReject(user.id)}
                      className="flex-1 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={14} /> Tolak
                    </button>
                    <button 
                      onClick={() => onApprove(user.id, UserRole.STAFF)}
                      className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-black text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Staff
                    </button>
                  </div>
                  <button 
                    onClick={() => onApprove(user.id, UserRole.ADMINISTRATOR)}
                    className="w-full py-3 border border-indigo-100 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Shield size={14} /> Jadikan Administrator
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Users Table */}
      <section>
        <h2 className="text-xl font-black text-slate-800 mb-6">Daftar Akun Aktif</h2>
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Kantor</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Level</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-bold">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        user.role === UserRole.ADMINISTRATOR ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-600">Aktif</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
