
import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Table as TableIcon
} from 'lucide-react';
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
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Visual Layout
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Reservation List
          </button>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Calendar size={18} />
          New Reservation
        </button>
      </div>

      {activeTab === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tables.map(table => (
            <div 
              key={table.id} 
              className={`relative bg-white p-6 rounded-3xl border transition-all ${
                table.status === TableStatus.AVAILABLE ? 'border-emerald-100 hover:border-emerald-300' : 
                table.status === TableStatus.BOOKED ? 'border-amber-100 hover:border-amber-300' : 
                'border-rose-100 hover:border-rose-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  table.status === TableStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600' : 
                  table.status === TableStatus.BOOKED ? 'bg-amber-50 text-amber-600' : 
                  'bg-rose-50 text-rose-600'
                }`}>
                  <TableIcon size={24} />
                </div>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>
              <p className="text-xl font-bold">Table {table.number}</p>
              <p className="text-xs text-slate-400 font-medium mb-3">{table.capacity} Person Capacity</p>
              
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                table.status === TableStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-700' : 
                table.status === TableStatus.BOOKED ? 'bg-amber-100 text-amber-700' : 
                'bg-rose-100 text-rose-700'
              }`}>
                {table.status}
              </div>

              {table.status !== TableStatus.AVAILABLE && (
                <button 
                  onClick={() => onUpdateTable(table.id, TableStatus.AVAILABLE)}
                  className="mt-4 w-full py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Mark Available
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Guest Name</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Table</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Date & Time</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Pax</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold">{booking.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.tableName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-slate-400" /> {booking.date}
                      <Clock size={14} className="text-slate-400 ml-2" /> {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Users size={16} /> {booking.pax}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">Confirmed</span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    No reservations found. Start by adding one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Table Reservation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. John Doe"
                  value={newBooking.name}
                  onChange={e => setNewBooking({...newBooking, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Table</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={newBooking.table}
                    onChange={e => setNewBooking({...newBooking, table: e.target.value})}
                  >
                    <option value="">Select Table</option>
                    {tables.filter(t => t.status === TableStatus.AVAILABLE).map(t => (
                      <option key={t.id} value={t.id}>Table {t.number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Number of Pax</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={newBooking.pax}
                    onChange={e => setNewBooking({...newBooking, pax: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={newBooking.date}
                    onChange={e => setNewBooking({...newBooking, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={newBooking.time}
                    onChange={e => setNewBooking({...newBooking, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBooking}
                disabled={!newBooking.name || !newBooking.table || !newBooking.date || !newBooking.time}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesView;
