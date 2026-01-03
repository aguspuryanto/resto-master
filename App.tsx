
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarCheck, 
  Package, 
  FileText, 
  Settings, 
  LogOut,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

import { Product, Order, Table, TableStatus, Expense, Booking, User, UserRole, UserStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_TABLES } from './constants';

// Views
import Dashboard from './views/Dashboard';
import POS from './views/POS';
import TablesView from './views/TablesView';
import Inventory from './views/Inventory';
import Accounting from './views/Accounting';
import AuthView from './views/AuthView';
import UserManagement from './views/UserManagement';

// Initial Dummies
const INITIAL_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Main Admin',
    email: 'admin@restomaster.com',
    password: 'admin123',
    role: UserRole.ADMINISTRATOR,
    status: UserStatus.ACTIVE,
    joinedAt: new Date(2023, 1, 1)
  },
  {
    id: 'staff1',
    name: 'Siti Kasir',
    email: 'staff@restomaster.com',
    password: 'staff123',
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE,
    joinedAt: new Date(2023, 11, 15)
  },
  {
    id: 'staff2',
    name: 'Budi Waiter',
    email: 'waiter@restomaster.com',
    password: 'waiter123',
    role: UserRole.STAFF,
    status: UserStatus.PENDING,
    joinedAt: new Date()
  }
];

type View = 'dashboard' | 'pos' | 'tables' | 'inventory' | 'accounting' | 'users' | 'settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu toggle

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const cost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = revenue - cost;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    return { revenue, cost, profit, pendingOrders };
  }, [orders, expenses]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setProducts(prev => prev.map(p => {
      const orderItem = order.items.find(item => item.product.id === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
      }
      return p;
    }));
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);
  const addExpense = (expense: Expense) => setExpenses(prev => [...prev, expense]);
  const handleRegister = (newUser: User) => setUsers(prev => [...prev, newUser]);

  const handleApproveUser = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: UserStatus.ACTIVE, role } : u));
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: UserStatus.REJECTED } : u));
  };

  if (!currentUser) {
    return <AuthView onLogin={setCurrentUser} users={users} onRegister={handleRegister} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'pos', label: 'POS Kasir', icon: <ShoppingBag size={20} /> },
    { id: 'tables', label: 'Booking', icon: <CalendarCheck size={20} /> },
    { id: 'inventory', label: 'Stok', icon: <Package size={20} /> },
    { id: 'accounting', label: 'Laporan', icon: <FileText size={20} /> },
  ];

  if (currentUser.role === UserRole.ADMINISTRATOR) {
    menuItems.push({ id: 'users', label: 'Staff', icon: <ShieldCheck size={20} /> });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex bg-white border-r border-slate-200 transition-all duration-300 flex-col w-64 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
            <Utensils size={24} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">RestoMaster</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-4">
          {menuItems.map(item => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeView === item.id}
              onClick={() => setActiveView(item.id as View)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
          <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => setCurrentUser(null)} />
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Utensils size={18} />
          </div>
          <span className="font-black text-lg text-slate-800">RestoMaster</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{currentUser.role}</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-3/4 max-w-xs h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <UserCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map(item => (
                <SidebarItem 
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeView === item.id}
                  onClick={() => { setActiveView(item.id as View); setIsSidebarOpen(false); }}
                />
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={() => { setActiveView('settings'); setIsSidebarOpen(false); }} />
                <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => setCurrentUser(null)} />
              </div>
            </nav>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 w-full h-full -z-10"></button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header Content (Inside main) */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 capitalize tracking-tight">{activeView === 'users' ? 'Manajemen User' : activeView.replace('-', ' ')}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Portal Restoran Digital</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-2 px-4 rounded-2xl group cursor-pointer hover:bg-white transition-all">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto pb-20 lg:pb-0">
            {activeView === 'dashboard' && <Dashboard stats={stats} orders={orders} expenses={expenses} tables={tables} />}
            {activeView === 'pos' && <POS products={products} tables={tables} onCompleteOrder={addOrder} updateTableStatus={updateTableStatus} />}
            {activeView === 'tables' && <TablesView tables={tables} bookings={bookings} onAddBooking={addBooking} onUpdateTable={updateTableStatus} />}
            {activeView === 'inventory' && <Inventory products={products} expenses={expenses} onAddExpense={addExpense} onUpdateProducts={setProducts} />}
            {activeView === 'accounting' && <Accounting orders={orders} expenses={expenses} />}
            {activeView === 'users' && currentUser.role === UserRole.ADMINISTRATOR && <UserManagement users={users} onApprove={handleApproveUser} onReject={handleRejectUser} />}
            {activeView === 'settings' && (
              <div className="max-w-2xl bg-white p-6 sm:p-10 rounded-2xl lg:rounded-[2.5rem] shadow-sm border border-slate-200">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6">Pengaturan Toko</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Restoran</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 font-medium" defaultValue="RestoMaster Indonesia" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pajak Makan di Tempat (PPN)</label>
                    <div className="relative">
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 font-medium" defaultValue="10" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all mt-4">Simpan Perubahan</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40">
          {menuItems.slice(0, 5).map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              {item.icon}
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    <div className={`shrink-0 ${active ? 'scale-110 transition-transform' : ''}`}>{icon}</div>
    <span className="font-bold text-sm tracking-tight whitespace-nowrap">{label}</span>
  </button>
);

export default App;
