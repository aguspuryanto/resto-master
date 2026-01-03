
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { formatCurrency } from '../constants';
import { Order, Expense, Table } from '../types';

interface DashboardProps {
  stats: { revenue: number, cost: number, profit: number, pendingOrders: number };
  orders: Order[];
  expenses: Expense[];
  tables: Table[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, orders, expenses, tables }) => {
  // Simple sales chart data
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.revenue)} 
          change="+12.5%" 
          positive={true} 
          icon={<TrendingUp className="text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard 
          title="Net Profit" 
          value={formatCurrency(stats.profit)} 
          change="+8.2%" 
          positive={true} 
          icon={<ShoppingBag className="text-indigo-600" />}
          bg="bg-indigo-50"
        />
        <StatCard 
          title="Daily Expenses" 
          value={formatCurrency(stats.cost)} 
          change="-2.4%" 
          positive={false} 
          icon={<AlertTriangle className="text-amber-600" />}
          bg="bg-amber-50"
        />
        <StatCard 
          title="Active Tables" 
          value={tables.filter(t => t.status === 'Occupied').length.toString()} 
          change="Live" 
          positive={true} 
          icon={<Users className="text-blue-600" />}
          bg="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Sales Overview</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Order #{order.id.slice(0, 5)}</p>
                  <p className="text-xs text-slate-500">{order.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-emerald-600">Paid</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>No recent orders found</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, positive, icon, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
      <div className={`flex items-center text-xs font-bold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;
