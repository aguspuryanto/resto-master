
import React from 'react';
import { TrendingUp, Users, ShoppingBag, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatCurrency } from '../constants';
import { Order, Expense, Table } from '../types';

interface DashboardProps {
  stats: { revenue: number, cost: number, profit: number, pendingOrders: number };
  orders: Order[];
  expenses: Expense[];
  tables: Table[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, orders, expenses, tables }) => {
  const chartData = [
    { name: 'Sen', sales: 4000 },
    { name: 'Sel', sales: 3000 },
    { name: 'Rab', sales: 5000 },
    { name: 'Kam', sales: 2780 },
    { name: 'Jum', sales: 1890 },
    { name: 'Sab', sales: 8390 },
    { name: 'Min', sales: 9490 },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Pendapatan" value={formatCurrency(stats.revenue)} change="+12.5%" positive={true} icon={<TrendingUp className="text-emerald-600" />} bg="bg-emerald-50" />
        <StatCard title="Laba Bersih" value={formatCurrency(stats.profit)} change="+8.2%" positive={true} icon={<ShoppingBag className="text-indigo-600" />} bg="bg-indigo-50" />
        <StatCard title="Pengeluaran" value={formatCurrency(stats.cost)} change="-2.4%" positive={false} icon={<AlertTriangle className="text-amber-600" />} bg="bg-amber-50" />
        <StatCard title="Meja Terisi" value={tables.filter(t => t.status === 'Occupied').length.toString()} change="Realtime" positive={true} icon={<Users className="text-blue-600" />} bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800">Tren Penjualan</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none font-bold">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <h2 className="text-lg font-black text-slate-800 mb-6">Aktivitas Terkini</h2>
          <div className="space-y-4 sm:space-y-6">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold truncate">Order #{order.id.slice(0, 5)}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold">{order.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-black text-slate-800">{formatCurrency(order.total)}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Lunas</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10 sm:py-20 text-slate-300">
                <ShoppingBag size={40} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">Belum ada transaksi</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors">
            Lihat Semua Log
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, positive, icon, bg }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
      <div className={`flex items-center text-xs font-black ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">{title}</p>
      <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;
