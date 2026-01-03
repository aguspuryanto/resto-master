
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
    <div className="space-y-8">
      {/* Pending Approvals Section */}
      {pendingUsers.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            Menunggu Persetujuan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingUsers.map(user => (
              <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <UserIcon size={28} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{user.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                  <p className="text-xs font-black uppercase text-slate-400 mb-1 tracking-widest">Permintaan Peran</p>
                  <p className="text-sm font-bold text-slate-700">Akses Staff Standar</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Mendaftar pada {user.joinedAt.toLocaleDateString()}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onReject(user.id)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Tolak
                  </button>
                  <button 
                    onClick={() => onApprove(user.id, UserRole.STAFF)}
                    className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Setujui Staff
                  </button>
                </div>
                <button 
                  onClick={() => onApprove(user.id, UserRole.ADMINISTRATOR)}
                  className="w-full mt-3 py-3 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Shield size={16} /> Setujui sebagai Admin
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Users Table */}
      <section>
        <h2 className="text-xl font-bold mb-6">Staff Aktif</h2>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Nama User</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Peran</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.role === UserRole.ADMINISTRATOR ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-bold text-slate-600">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
