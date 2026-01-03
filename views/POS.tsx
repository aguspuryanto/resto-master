
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Minus, 
  Plus, 
  ChefHat, 
  CreditCard,
  X,
  ShoppingBag,
  Banknote,
  QrCode,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ReceiptText,
  Printer
} from 'lucide-react';
import { Product, Order, OrderType, Table, TableStatus, OrderItem } from '../types';
import { CATEGORIES, formatCurrency } from '../constants';

interface POSProps {
  products: Product[];
  tables: Table[];
  onCompleteOrder: (order: Order) => void;
  updateTableStatus: (id: string, status: TableStatus) => void;
}

type PaymentMethod = 'CASH' | 'CARD' | 'QRIS' | null;
type CheckoutStep = 'CART' | 'PAYMENT_SELECTION' | 'PAYMENT_PROCESSING' | 'SUCCESS';

const POS: React.FC<POSProps> = ({ products, tables, onCompleteOrder, updateTableStatus }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false); // Mobile cart overlay
  
  // Payment Flow States
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('CART');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      !p.isDeleted &&
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = orderType === OrderType.DINE_IN ? subtotal * 0.1 : 0;
  const total = subtotal + tax;

  const handleStartPayment = () => {
    if (cart.length === 0) return;
    setCheckoutStep('PAYMENT_SELECTION');
  };

  const handleProcessPayment = async (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCheckoutStep('PAYMENT_PROCESSING');
    
    const statuses = ['Connecting...', 'Authenticating...', 'Verifying...', 'Finalizing...'];
    for (const status of statuses) {
      setProcessingStatus(status);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date(),
      type: orderType,
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'Completed',
      tableId: selectedTable || undefined
    };

    if (selectedTable) updateTableStatus(selectedTable, TableStatus.OCCUPIED);

    onCompleteOrder(newOrder);
    setLastCompletedOrder(newOrder);
    setCheckoutStep('SUCCESS');
  };

  const handlePrintReceipt = () => {
    if (!lastCompletedOrder) return;
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return alert('Allow pop-ups to print.');
    
    const itemsHtml = lastCompletedOrder.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${item.quantity}x ${item.product.name}</span>
        <span>${formatCurrency(item.product.price * item.quantity)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html><head><title>Receipt</title><style>body{font-family:'Courier New';padding:20px;font-size:12px;}.flex{display:flex;justify-content:space-between;}.center{text-align:center;}.bold{font-weight:bold;}.dashed{border-top:1px dashed #000;margin:10px 0;}</style></head>
      <body><div class="center header"><h2 style="margin:0;">RESTOMASTER</h2><p>Jl. Kuliner No. 123, Jakarta</p></div><div class="dashed"></div>
      <div class="flex"><span>Date:</span><span>${lastCompletedOrder.date.toLocaleString()}</span></div><div class="flex"><span>ID:</span><span>#${lastCompletedOrder.id}</span></div><div class="dashed"></div>
      <div class="bold">ITEMS</div>${itemsHtml}<div class="dashed"></div>
      <div class="flex"><span>Subtotal:</span><span>${formatCurrency(lastCompletedOrder.subtotal)}</span></div><div class="flex"><span>Tax:</span><span>${formatCurrency(lastCompletedOrder.tax)}</span></div><div class="flex bold"><span>TOTAL:</span><span>${formatCurrency(lastCompletedOrder.total)}</span></div>
      <div class="dashed"></div><div class="center">TERIMA KASIH</div><script>window.onload=()=>{window.print();setTimeout(window.close,500);};</script></body></html>
    `);
    printWindow.document.close();
  };

  const resetPOS = () => {
    setCart([]);
    setSelectedTable('');
    setCheckoutStep('CART');
    setPaymentMethod(null);
    setLastCompletedOrder(null);
    setIsCartOpen(false);
  };

  const CartContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag size={24} className="text-indigo-600" />
          Order Details
        </h2>
        <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsCartOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2 bg-slate-50/50 border-b border-slate-100">
        <button 
          onClick={() => setOrderType(OrderType.DINE_IN)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${orderType === OrderType.DINE_IN ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500'}`}
        >
          <ChefHat size={18} />
          <span className="text-[10px] font-bold">Dine-In</span>
        </button>
        <button 
          onClick={() => setOrderType(OrderType.TAKE_AWAY)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${orderType === OrderType.TAKE_AWAY ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500'}`}
        >
          <ShoppingBag size={18} />
          <span className="text-[10px] font-bold">Take Away</span>
        </button>
      </div>

      {orderType === OrderType.DINE_IN && (
        <div className="px-3 py-3 bg-white border-b border-slate-100">
          <select 
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
          >
            <option value="">Select Table (Optional)</option>
            {tables.filter(t => t.status === TableStatus.AVAILABLE).map(t => (
              <option key={t.id} value={t.id}>Table {t.number} ({t.capacity} Pax)</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {cart.map(item => (
          <div key={item.product.id} className="flex gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
              <img src={item.product.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">{item.product.name}</p>
              <p className="text-[10px] sm:text-xs text-indigo-600 font-bold">{formatCurrency(item.product.price)}</p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 rounded-lg p-1 h-fit">
              <button onClick={() => updateQuantity(item.product.id, -1)} className="p-0.5 hover:bg-white rounded"><Minus size={12} /></button>
              <span className="text-[10px] sm:text-xs font-bold w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, 1)} className="p-0.5 hover:bg-white rounded"><Plus size={12} /></button>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="text-rose-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 py-10">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Cart is empty</p>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-slate-500">Total</span>
          <span className="font-black text-indigo-600 text-lg">{formatCurrency(total)}</span>
        </div>
        <button 
          disabled={cart.length === 0}
          onClick={handleStartPayment}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg"
        >
          <CreditCard size={20} />
          Pay Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full gap-0 lg:gap-8 relative overflow-hidden">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search menu..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {['All', ...CATEGORIES].map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold text-xs transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20 sm:pb-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="group bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[9px] font-black text-slate-700">
                  {product.stock}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 truncate">{product.name}</h3>
              <p className="text-indigo-600 font-black text-xs sm:text-sm mt-auto">{formatCurrency(product.price)}</p>
            </div>
          ))}
        </div>

        {/* Floating Cart Button for Mobile */}
        {cart.length > 0 && (
          <button 
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden fixed bottom-20 left-4 right-4 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-between px-6 shadow-2xl z-40 animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={24} />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-indigo-600">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <span>View Order</span>
            </div>
            <span>{formatCurrency(total)}</span>
          </button>
        )}
      </div>

      {/* Cart Sidebar (Desktop) */}
      <div className="hidden lg:flex w-80 xl:w-96 bg-white border border-slate-200 rounded-3xl flex-col shadow-sm">
        <CartContent />
      </div>

      {/* Cart Drawer (Mobile) */}
      {isCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <CartContent />
          </div>
        </div>
      )}

      {/* Checkout Modals (Same logic, but ensure responsiveness) */}
      {checkoutStep !== 'CART' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white sm:rounded-[2.5rem] w-full max-w-4xl h-full sm:h-auto sm:min-h-[600px] flex flex-col sm:flex-row overflow-hidden shadow-2xl scale-in-center">
            
            {/* Summary (Mobile Top / Desktop Left) */}
            <div className="w-full sm:w-80 bg-slate-50 p-6 sm:p-10 border-b sm:border-r border-slate-200 flex flex-col max-h-[40vh] sm:max-h-none overflow-y-auto">
              <button onClick={() => setCheckoutStep('CART')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-colors text-sm">
                <ChevronLeft size={18} /> Back
              </button>
              <div className="flex-1 overflow-y-auto hidden sm:block">
                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Bill Summary</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600 truncate mr-2">{item.quantity}x {item.product.name}</span>
                      <span className="text-slate-800 shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 mt-4 sm:mt-6">
                <div className="flex justify-between text-xs text-slate-500"><p>Subtotal</p><p>{formatCurrency(subtotal)}</p></div>
                <div className="flex justify-between text-xl font-black text-indigo-600 mt-2"><p>Total</p><p>{formatCurrency(total)}</p></div>
              </div>
            </div>

            {/* Methods (Main Content) */}
            <div className="flex-1 p-6 sm:p-10 flex flex-col bg-white overflow-y-auto">
              {checkoutStep === 'PAYMENT_SELECTION' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Checkout</h2>
                  <p className="text-slate-500 mb-8 font-medium text-sm sm:text-base">Pilih metode pembayaran yang tersedia.</p>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <PaymentOption icon={<Banknote className="text-emerald-500" size={24} />} title="Tunai (Cash)" description="Bayar manual di kasir" onClick={() => handleProcessPayment('CASH')} />
                    <PaymentOption icon={<CreditCard className="text-indigo-500" size={24} />} title="Kartu Debit/Kredit" description="Visa, Mastercard, atau GPN" onClick={() => handleProcessPayment('CARD')} />
                    <PaymentOption icon={<QrCode className="text-amber-500" size={24} />} title="QRIS / Digital Pay" description="GoPay, OVO, ShopeePay, dll" onClick={() => handleProcessPayment('QRIS')} />
                  </div>
                </div>
              )}

              {checkoutStep === 'PAYMENT_PROCESSING' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-20 h-20 mb-6 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 relative">
                    <Loader2 size={32} className="animate-spin" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 mb-2">Memproses Pembayaran</h2>
                  <p className="text-sm text-slate-500 font-medium animate-pulse">{processingStatus}</p>
                </div>
              )}

              {checkoutStep === 'SUCCESS' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 p-4">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mb-6 sm:8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Transaksi Berhasil!</h2>
                  <p className="text-sm sm:text-base text-slate-500 font-medium mb-8">Data telah tersimpan di sistem laporan keuangan.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <button onClick={handlePrintReceipt} className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm">
                      <Printer size={16} /> Print Struk
                    </button>
                    <button onClick={resetPOS} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm">
                      Order Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentOption = ({ icon, title, description, onClick }: any) => (
  <button onClick={onClick} className="group flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-2xl text-left transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-slate-800 text-sm truncate">{title}</h4>
      <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{description}</p>
    </div>
    <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
      <Plus size={14} />
    </div>
  </button>
);

export default POS;
