
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  PieChart as PieIcon, 
  FileText, 
  Sparkles,
  Loader2
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

  const totalSales = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalTax = orders.reduce((sum, o) => sum + o.tax, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpense;

  const analyzeFinancials = async () => {
    setIsAnalyzing(true);
    const summary = `Total Sales: ${totalSales}, Total Expense: ${totalExpense}, Net Profit: ${netProfit}. Breakdown expenses: ${expenses.map(e => e.description + '(' + e.amount + ')').join(', ')}`;
    const advice = await getFinancialAdvice(summary);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Financial Smart Insights</h2>
              <p className="text-indigo-100 text-sm">Let AI analyze your business performance</p>
            </div>
          </div>
          <button 
            onClick={analyzeFinancials}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <BarChart2 size={18} />}
            Generate Analysis
          </button>
        </div>
        
        {aiAdvice ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-sm leading-relaxed whitespace-pre-line">{aiAdvice}</p>
          </div>
        ) : (
          <div className="text-center py-4 text-indigo-100 italic opacity-80">
            Click the button above for automated financial advice based on your current data.
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setReportType('PL')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${reportType === 'PL' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}
        >
          Laba Rugi (P&L)
        </button>
        <button 
          onClick={() => setReportType('BS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${reportType === 'BS' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}
        >
          Neraca (Balance Sheet)
        </button>
        <button 
          onClick={() => setReportType('Ledger')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${reportType === 'Ledger' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}
        >
          Buku Besar (Ledger)
        </button>
      </div>

      {reportType === 'PL' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
          <div className="p-8 border-b border-slate-100 text-center">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Laporan Laba Rugi</h3>
            <p className="text-slate-500">Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="p-8 space-y-8">
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pendapatan Operasional</h4>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Penjualan Makanan & Minuman</span>
                <span className="font-bold">{formatCurrency(totalSales)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold bg-slate-50 px-2 rounded-lg mt-2">
                <span>Total Pendapatan</span>
                <span>{formatCurrency(totalSales)}</span>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Beban Operasional</h4>
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between py-2 border-b border-slate-100">
                  <span>{e.description}</span>
                  <span className="text-rose-600 font-medium">({formatCurrency(e.amount)})</span>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-sm text-slate-400">Belum ada catatan pengeluaran.</p>}
              <div className="flex justify-between py-2 font-bold bg-slate-50 px-2 rounded-lg mt-2">
                <span>Total Beban</span>
                <span className="text-rose-600">{formatCurrency(totalExpense)}</span>
              </div>
            </section>

            <div className="p-6 bg-indigo-50 rounded-3xl flex justify-between items-center">
              <div>
                <h4 className="text-indigo-600 font-bold">Laba Bersih (Net Profit)</h4>
                <p className="text-xs text-indigo-400">Setelah dikurangi beban operasional</p>
              </div>
              <span className={`text-3xl font-black ${netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {reportType === 'BS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-4xl mx-auto text-center py-40">
           <PieIcon size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-400">Balance Sheet data is generated dynamically based on active accounts.<br/>Currently displaying simulated Equity of {formatCurrency(totalSales - totalExpense + 50000000)}.</p>
        </div>
      )}

      {reportType === 'Ledger' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Description</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Debit</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-3">{o.date.toLocaleDateString()}</td>
                  <td className="px-6 py-3">Sales Order #{o.id.slice(0,5)}</td>
                  <td className="px-6 py-3 font-bold text-emerald-600">{formatCurrency(o.total)}</td>
                  <td className="px-6 py-3">-</td>
                </tr>
              ))}
              {expenses.map(e => (
                <tr key={e.id}>
                  <td className="px-6 py-3">{e.date.toLocaleDateString()}</td>
                  <td className="px-6 py-3">{e.description}</td>
                  <td className="px-6 py-3">-</td>
                  <td className="px-6 py-3 font-bold text-rose-600">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Accounting;
