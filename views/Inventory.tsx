
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { Product, Expense } from '../types';
import { CATEGORIES, formatCurrency } from '../constants';

interface InventoryProps {
  products: Product[];
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onUpdateProducts: (products: Product[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, expenses, onAddExpense, onUpdateProducts }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'expenses'>('products');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: 0, category: 'Ingredients' });

  const handleAddExpense = () => {
    onAddExpense({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      category: expenseForm.category,
      amount: expenseForm.amount,
      description: expenseForm.description
    });
    setShowExpenseModal(false);
    setExpenseForm({ description: '', amount: 0, category: 'Ingredients' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Menu Stock
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'expenses' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Business Expenses
          </button>
        </div>
        <button 
          onClick={() => activeTab === 'products' ? {} : setShowExpenseModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={18} />
          {activeTab === 'products' ? 'Add Menu Item' : 'Record Expense'}
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group shadow-sm">
              <div className="relative h-40">
                <img src={product.image} className="w-full h-full object-cover" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {product.stock} in Stock
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">{product.category}</p>
                <h3 className="font-bold text-slate-800 mb-4">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 font-bold">{formatCurrency(product.price)}</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit2 size={16} /></button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Description</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{expense.date.toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600">{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Record New Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Expense Description</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                  placeholder="e.g. Pembelian Telur 5kg"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                >
                  <option>Ingredients</option>
                  <option>Utilities</option>
                  <option>Salary</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (IDR)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({...expenseForm, amount: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowExpenseModal(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600">Cancel</button>
              <button onClick={handleAddExpense} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700">Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
