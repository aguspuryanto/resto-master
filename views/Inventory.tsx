
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle,
  TrendingDown,
  X,
  Image as ImageIcon
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
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: CATEGORIES[0],
    stock: 0,
    image: ''
  });

  const activeProducts = products.filter(p => !p.isDeleted);

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

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        category: CATEGORIES[0],
        stock: 0,
        image: ''
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...p, ...productForm } : p
      );
      onUpdateProducts(updatedProducts);
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...productForm,
        image: productForm.image || `https://picsum.photos/seed/${productForm.name}/200/200`
      };
      onUpdateProducts([...products, newProduct]);
    }
    setShowProductModal(false);
  };

  const handleSoftDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus item ini? (Soft Delete)')) {
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, isDeleted: true } : p
      );
      onUpdateProducts(updatedProducts);
    }
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
          onClick={() => activeTab === 'products' ? handleOpenProductModal() : setShowExpenseModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={18} />
          {activeTab === 'products' ? 'Add Menu Item' : 'Record Expense'}
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map(product => (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group shadow-sm flex flex-col">
              <div className="relative h-40">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {product.stock} in Stock
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">{product.category}</p>
                <h3 className="font-bold text-slate-800 mb-4">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-indigo-600 font-bold">{formatCurrency(product.price)}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenProductModal(product)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleSoftDelete(product.id)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {activeProducts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
               <Package size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-medium">Belum ada produk. Klik tombol di atas untuk menambah.</p>
            </div>
          )}
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

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <p className="text-indigo-100 text-xs mt-1">Kelola detail menu dan ketersediaan stok</p>
              </div>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Menu</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  placeholder="Contoh: Nasi Goreng Gila"
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Harga (IDR)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Stok Awal</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                    value={productForm.stock}
                    onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Kategori</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 font-medium appearance-none"
                  value={productForm.category}
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">URL Gambar (Opsional)</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={e => setProductForm({...productForm, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowProductModal(false)} 
                  className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveProduct}
                  disabled={!productForm.name || productForm.price <= 0}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  {editingProduct ? 'Update Item' : 'Tambah Menu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
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
