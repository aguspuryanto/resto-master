
import React, { useState } from 'react';
import { Utensils, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, users, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        if (user.status !== UserStatus.ACTIVE) {
          setError(`Akun Anda masih berstatus ${user.status}. Silakan hubungi Administrator untuk persetujuan.`);
        } else {
          onLogin(user);
        }
      } else {
        setError('Email atau password salah.');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('Email sudah terdaftar.');
      } else {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password,
          role: UserRole.STAFF, // Default requested role
          status: UserStatus.PENDING,
          joinedAt: new Date()
        };
        onRegister(newUser);
        setSuccess('Registrasi berhasil! Mohon tunggu persetujuan dari Administrator sebelum dapat masuk.');
        setIsLogin(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden relative">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[120px]"></div>

      <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-indigo-600 text-white relative">
        <div className="max-w-md space-y-8 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl border border-white/30">
            <Utensils size={32} />
          </div>
          <h1 className="text-5xl font-black leading-tight">Kelola Restoran Anda dengan Cerdas.</h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            RestoMaster menyediakan solusi POS, manajemen stok, dan laporan keuangan terintegrasi untuk membantu bisnis Anda tumbuh lebih cepat.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium self-center">+500 Pemilik Restoran Bergabung</p>
          </div>
        </div>
        {/* Simple decorative element */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-tl-[100px]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {isLogin ? 'Selamat Datang Kembali!' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Masuk ke portal RestoMaster Anda' : 'Bergabunglah dengan ekosistem RestoMaster'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex gap-3 text-sm animate-in shake duration-300">
                <AlertCircle size={20} className="shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex gap-3 text-sm animate-in zoom-in-95">
                <AlertCircle size={20} className="shrink-0" />
                <p className="font-semibold">{success}</p>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-slate-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Kantor</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@restoran.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-slate-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                {isLogin && <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Lupa Password?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-slate-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} 
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 underline-offset-4 hover:underline"
              >
                {isLogin ? 'Mulai Daftar' : 'Masuk Disini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
