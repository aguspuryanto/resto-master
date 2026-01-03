
import React, { useState } from 'react';
import { Users, Calendar, Clock, MoreVertical, Table as TableIcon, X } from 'lucide-react';
import { Table, TableStatus, Booking } from '../types';

interface TablesProps {
  tables: Table[];
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onUpdateTable: (id: string, status: TableStatus) => void;
}

const TablesView: React.FC<TablesProps> = ({ tables, bookings, onAddBooking, onUpdateTable }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'bookings'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ name: '', table: '', date: '', time: '', pax: 2 });

  const handleBooking = () => {
    onAddBooking({
      id: Math.random().toString(36).substr(2, 9),
      customerName: newBooking.name,
      tableName: `Table ${newBooking.table}`,
      date: newBooking.date,
      time: newBooking.time,
      pax: newBooking.pax
    });
    onUpdateTable(newBooking.table, TableStatus.BOOKED);
    setShowModal(false);
    setNewBooking({ name: '', table: '', date: '', time: '', pax: 2 });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-full sm:w-fit">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Tata Letak
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Daftar Reservasi
          </button>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg"
        >
          <Calendar size={18} />
          <span>Buat Reservasi</span>
        </button>
      </div>

      {activeTab === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
          {tables.map(table => (
            <div 
              key={table.id} 
              className={`relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                table.status === TableStatus.AVAILABLE ? 'border-emerald-100 hover:border-emerald-200' : 
                table.status === TableStatus.BOOKED ? 'border-amber-100 hover:border-amber-200' : 
                'border-rose-100 hover:border-rose-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  table.status === TableStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600' : 
                  table.status === TableStatus.BOOKED ? 'bg-amber-50 text-amber-600' : 
                  'bg-rose-50 text-rose-600'
                }`}>
                  <TableIcon size={20} />
                </div>
                <button className="p-1 text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
              </div>
              <p className="text-base sm:text-xl font-black text-slate-800">Meja {table.number}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{table.capacity} Pax</p>
              
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                table.status === TableStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-700' : 
                table.status === TableStatus.BOOKED ? 'bg-amber-100 text-amber-700' : 
                'bg-rose-100 text-rose-700'
              }`}>
                {table.status}
              </div>

              {table.status !== TableStatus.AVAILABLE && (
                <button 
                  onClick={() => onUpdateTable(table.id, TableStatus.AVAILABLE)}
                  className="mt-4 w-full py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100"
                >
                  Reset Status
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Nama Tamu</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">No. Meja</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Waktu</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Pax</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{booking.customerName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-indigo-600">{booking.tableName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-700"><Users size={14} /> {booking.pax}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg">Confirmed</span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-medium">Belum ada reservasi aktif.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Modal (Responsive) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">Buat Reservasi Baru</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Customer</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="e.g. Budi Santoso"
                  value={newBooking.name}
                  onChange={e => setNewBooking({...newBooking, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pilih Meja</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-bold text-sm"
                    value={newBooking.table}
                    onChange={e => setNewBooking({...newBooking, table: e.target.value})}
                  >
                    <option value="">--</option>
                    {tables.filter(t => t.status === TableStatus.AVAILABLE).map(t => (
                      <option key={t.id} value={t.id}>Meja {t.number}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Jumlah Orang</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium"
                    value={newBooking.pax}
                    onChange={e => setNewBooking({...newBooking, pax: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-xs font-bold" value={newBooking.date} onChange={e => setNewBooking({...newBooking, date: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Jam</label>
                  <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-xs font-bold" value={newBooking.time} onChange={e => setNewBooking({...newBooking, time: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-xl font-bold text-slate-500 text-sm">Batal</button>
              <button 
                onClick={handleBooking}
                disabled={!newBooking.name || !newBooking.table || !newBooking.date || !newBooking.time}
                className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesView;
