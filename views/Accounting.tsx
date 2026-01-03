
import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  PieChart as PieIcon, 
  FileText, 
  Sparkles,
  Loader2,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Order, Expense } from '../types';
import { formatCurrency } from '../constants';
import { getFinancialAdvice } from '../services/geminiService';

interface AccountingProps {
  orders: Order[];
  expenses: Expense[];
}

const Accounting: React.FC<AccountingProps> = ({ orders, expenses }) => {
  const [reportType, setReportType] = useState<'PL' | 'BS' | 'Ledger'>('PL');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Date Filtering State
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filtered Data
  const filteredOrders = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return orders.filter(o => {
      const d = new Date(o.date);
      return d >= start && d <= end;
    });
  }, [orders, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
  }, [expenses, startDate, endDate]);

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalTax = filteredOrders.reduce((sum, o) => sum + o.tax, 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpense;

  const analyzeFinancials = async () => {
    setIsAnalyzing(true);
    const summary = `Periode: ${startDate} s/d ${endDate}. Total Sales: ${totalSales}, Total Expense: ${totalExpense}, Net Profit: ${netProfit}. Breakdown expenses: ${filteredExpenses.map(e => e.description + '(' + e.amount + ')').join(', ')}`;
    const advice = await getFinancialAdvice(summary);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const filename = `Report_${reportType}_${startDate}_to_${endDate}.csv`;

    if (reportType === 'PL') {
      csvContent += "Category,Description,Amount\n";
      csvContent += `Revenue,Total Sales,"${totalSales}"\n`;
      filteredExpenses.forEach(e => {
        csvContent += `Expense,"${e.description}","${e.amount}"\n`;
      });
      csvContent += `Summary,Net Profit,"${netProfit}"\n`;
    } else if (reportType === 'Ledger') {
      csvContent += "Date,Description,Debit,Credit\n";
      filteredOrders.forEach(o => {
        csvContent += `"${o.date.toLocaleDateString()}","Sales Order #${o.id.slice(0,5)}","${o.total}","0"\n`;
      });
      filteredExpenses.forEach(e => {
        csvContent += `"${e.date.toLocaleDateString()}","${e.description}","0","${e.amount}"\n`;
      });
    } else {
      csvContent += "Account,Balance\n";
      csvContent += `Equity,"${totalSales - totalExpense + 50000000}"\n`;
      csvContent += `Retained Earnings,"${netProfit}"\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-black">Asisten Keuangan Cerdas</h2>
              <p className="text-indigo-100 text-sm font-medium">Analisis performa bisnis dengan AI</p>
            </div>
          </div>
          <button 
            onClick={analyzeFinancials}
            disabled={isAnalyzing}
            className="w-full lg:w-auto px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <BarChart2 size={20} />}
            Generate Analisis
          </button>
        </div>
        
        {aiAdvice ? (
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-sm lg:text-base leading-relaxed whitespace-pre-line font-medium">{aiAdvice}</p>
          </div>
        ) : (
          <div className="mt-6 text-center py-4 text-indigo-100 italic opacity-80 text-sm">
            Klik tombol di atas untuk mendapatkan saran finansial otomatis berdasarkan data periode ini.
          </div>
        )}
      </div>

      {/* Filter & Export Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Filter size={14} />
            Periode
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="date" 
              className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-300 font-black">-</span>
            <input 
              type="date" 
              className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={exportToCSV}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-md"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setReportType('PL')}
          className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${reportType === 'PL' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Laba Rugi
        </button>
        <button 
          onClick={() => setReportType('BS')}
          className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${reportType === 'BS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Neraca
        </button>
        <button 
          onClick={() => setReportType('Ledger')}
          className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${reportType === 'Ledger' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Buku Besar
        </button>
      </div>

      {reportType === 'PL' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-in fade-in duration-500">
          <div className="p-8 lg:p-12 border-b border-slate-100 text-center">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-800 uppercase tracking-[0.2em]">Statement of Profit or Loss</h3>
            <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">
              Periode: {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="p-6 lg:p-12 space-y-10">
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                Pendapatan
                <div className="flex-1 h-px bg-slate-100"></div>
              </h4>
              <div className="flex justify-between py-3 border-b border-slate-100 text-sm font-bold text-slate-600">
                <span>Penjualan Bersih (Makan & Minum)</span>
                <span className="text-slate-900">{formatCurrency(totalSales)}</span>
              </div>
              <div className="flex justify-between py-4 font-black bg-emerald-50 text-emerald-700 px-4 rounded-xl mt-4">
                <span>TOTAL PENDAPATAN</span>
                <span>{formatCurrency(totalSales)}</span>
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                Beban Operasional
                <div className="flex-1 h-px bg-slate-100"></div>
              </h4>
              <div className="space-y-1">
                {filteredExpenses.map(e => (
                  <div key={e.id} className="flex justify-between py-3 border-b border-slate-50 text-sm font-bold text-slate-600">
                    <span className="capitalize">{e.description}</span>
                    <span className="text-rose-600">({formatCurrency(e.amount)})</span>
                  </div>
                ))}
                {filteredExpenses.length === 0 && <p className="text-sm text-slate-300 py-4 italic">Belum ada catatan pengeluaran di periode ini.</p>}
              </div>
              <div className="flex justify-between py-4 font-black bg-rose-50 text-rose-700 px-4 rounded-xl mt-4">
                <span>TOTAL BEBAN</span>
                <span>{formatCurrency(totalExpense)}</span>
              </div>
            </section>

            <div className="p-8 bg-slate-900 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center text-white gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Laba / (Rugi) Bersih</h4>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter mt-1">Net Income for the period</p>
              </div>
              <span className={`text-3xl lg:text-4xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {reportType === 'BS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 max-w-4xl mx-auto text-center py-40 animate-in fade-in duration-500">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <PieIcon size={40} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-2">Statement of Financial Position</h3>
           <p className="text-slate-400 font-medium max-w-sm mx-auto">Balance Sheet dihasilkan secara dinamis berdasarkan akun aktif. Saat ini menampilkan simulasi Ekuitas sebesar {formatCurrency(totalSales - totalExpense + 50000000)}.</p>
        </div>
      )}

      {reportType === 'Ledger' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Keterangan</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Debit (Masuk)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kredit (Keluar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-500">{o.date.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">Sales Order #{o.id.slice(0,5)}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black">{o.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">{formatCurrency(o.total)}</td>
                    <td className="px-6 py-4 text-slate-300">-</td>
                  </tr>
                ))}
                {filteredExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-500">{e.date.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{e.description}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black">{e.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">-</td>
                    <td className="px-6 py-4 font-black text-rose-600">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">
                      Tidak ada transaksi dalam periode ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
