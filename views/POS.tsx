
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Minus, 
  Plus, 
  ChefHat, 
  CreditCard,
  X,
  ShoppingBag,
  Wallet,
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
  
  // Payment Flow States
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('CART');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
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

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

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
    
    // Simulate real-world payment gateway latency
    const statuses = ['Connecting to provider...', 'Authenticating transaction...', 'Verifying funds...', 'Finalizing payment...'];
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

    if (selectedTable) {
      updateTableStatus(selectedTable, TableStatus.OCCUPIED);
    }

    onCompleteOrder(newOrder);
    setLastCompletedOrder(newOrder);
    setCheckoutStep('SUCCESS');
  };

  const handlePrintReceipt = () => {
    if (!lastCompletedOrder) return;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups to print receipts.');
      return;
    }

    const itemsHtml = lastCompletedOrder.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${item.quantity}x ${item.product.name}</span>
        <span>${formatCurrency(item.product.price * item.quantity)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${lastCompletedOrder.id}</title>
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              padding: 20px; 
              color: #000; 
              font-size: 13px; 
              line-height: 1.4;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .dashed { border-top: 1px dashed #000; margin: 10px 0; }
            .flex { display: flex; justify-content: space-between; }
            .header { margin-bottom: 15px; }
            .footer { margin-top: 20px; font-size: 11px; }
            @media print {
              @page { margin: 0; }
              body { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="center header">
            <h2 style="margin: 0;">RESTOMASTER</h2>
            <p style="margin: 2px 0;">Jl. Kuliner No. 123, Jakarta</p>
            <p style="margin: 2px 0;">Telp: (021) 555-0123</p>
          </div>
          
          <div class="dashed"></div>
          
          <div class="flex"><span>Date:</span> <span>${lastCompletedOrder.date.toLocaleString('id-ID')}</span></div>
          <div class="flex"><span>Order ID:</span> <span>#${lastCompletedOrder.id}</span></div>
          <div class="flex"><span>Type:</span> <span>${lastCompletedOrder.type}</span></div>
          ${lastCompletedOrder.tableId ? `<div class="flex"><span>Table:</span> <span>${lastCompletedOrder.tableId}</span></div>` : ''}
          
          <div class="dashed"></div>
          
          <div class="bold" style="margin-bottom: 8px;">ITEMS</div>
          ${itemsHtml}
          
          <div class="dashed"></div>
          
          <div class="flex"><span>Subtotal:</span> <span>${formatCurrency(lastCompletedOrder.subtotal)}</span></div>
          <div class="flex"><span>Tax (10%):</span> <span>${formatCurrency(lastCompletedOrder.tax)}</span></div>
          <div class="flex bold" style="font-size: 15px; margin-top: 5px;">
            <span>TOTAL:</span> <span>${formatCurrency(lastCompletedOrder.total)}</span>
          </div>
          <div class="flex" style="margin-top: 5px;">
            <span>Payment:</span> <span>${paymentMethod || 'PAID'}</span>
          </div>
          
          <div class="dashed"></div>
          
          <div class="center footer">
            <p class="bold">TERIMA KASIH</p>
            <p>Selamat Menikmati Hidangan Kami!</p>
            <p>www.restomaster.com</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetPOS = () => {
    setCart([]);
    setSelectedTable('');
    setCheckoutStep('CART');
    setPaymentMethod(null);
    setAmountTendered('');
    setLastCompletedOrder(null);
  };

  const cashChange = parseFloat(amountTendered) - total;

  return (
    <div className="flex h-full gap-8 relative">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search food or drinks..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', ...CATEGORIES].map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-8 pr-2">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="group bg-white p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                  Stock: {product.stock}
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">{product.name}</h3>
              <p className="text-indigo-600 font-bold text-sm">{formatCurrency(product.price)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white border border-slate-200 rounded-3xl flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} className="text-indigo-600" />
            Order Details
          </h2>
        </div>

        <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50/50">
          <button 
            onClick={() => setOrderType(OrderType.DINE_IN)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${orderType === OrderType.DINE_IN ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-white'}`}
          >
            <ChefHat size={20} />
            <span className="text-xs font-bold">Dine-In</span>
          </button>
          <button 
            onClick={() => setOrderType(OrderType.TAKE_AWAY)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${orderType === OrderType.TAKE_AWAY ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-white'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-xs font-bold">Take Away</span>
          </button>
        </div>

        {orderType === OrderType.DINE_IN && (
          <div className="px-4 pb-4">
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
            >
              <option value="">Select Table (Optional)</option>
              {tables.filter(t => t.status === TableStatus.AVAILABLE).map(t => (
                <option key={t.id} value={t.id}>Table {t.number} ({t.capacity} Pax)</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.product.name}</p>
                <p className="text-xs text-indigo-600 font-bold">{formatCurrency(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 h-fit">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="p-0.5 hover:bg-white rounded"><Minus size={14} /></button>
                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="p-0.5 hover:bg-white rounded"><Plus size={14} /></button>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} className="text-rose-500 hover:text-rose-700 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Empty Cart</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30 rounded-b-3xl space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax {orderType === OrderType.DINE_IN ? '(10%)' : '(0%)'}</span>
            <span className="font-semibold">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-3 text-slate-800">
            <span>Total</span>
            <span className="text-indigo-600">{formatCurrency(total)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleStartPayment}
            className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
          >
            <CreditCard size={20} />
            Pay {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      {checkoutStep !== 'CART' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl min-h-[600px] flex overflow-hidden shadow-2xl scale-in-center">
            
            {/* Left side: Order Summary */}
            <div className="w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col">
              <button 
                onClick={() => setCheckoutStep('CART')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-10 transition-colors"
              >
                <ChevronLeft size={20} />
                Back to POS
              </button>
              
              <div className="flex-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Your Bill</h3>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">{item.quantity}x {item.product.name}</span>
                      <span className="font-bold text-slate-800">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-indigo-600 mt-4">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Right side: Payment Method Interface */}
            <div className="flex-1 p-10 flex flex-col relative bg-white">
              
              {checkoutStep === 'PAYMENT_SELECTION' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Checkout</h2>
                  <p className="text-slate-500 mb-10 font-medium">Please select your preferred payment method.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <PaymentOption 
                      icon={<Banknote className="text-emerald-500" size={32} />}
                      title="Cash Payment"
                      description="Pay with physical currency at the counter"
                      onClick={() => handleProcessPayment('CASH')}
                    />
                    <PaymentOption 
                      icon={<CreditCard className="text-indigo-500" size={32} />}
                      title="Credit/Debit Card"
                      description="Visa, Mastercard, or GPN card payment"
                      onClick={() => handleProcessPayment('CARD')}
                    />
                    <PaymentOption 
                      icon={<QrCode className="text-amber-500" size={32} />}
                      title="QRIS Digital Payment"
                      description="Scan using GoPay, OVO, ShopeePay, etc."
                      onClick={() => handleProcessPayment('QRIS')}
                    />
                  </div>
                </div>
              )}

              {checkoutStep === 'PAYMENT_PROCESSING' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 mb-8 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 relative">
                    <Loader2 size={48} className="animate-spin" />
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-ping opacity-20"></div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Processing Payment</h2>
                  <p className="text-slate-500 font-medium animate-pulse">{processingStatus}</p>
                  
                  {paymentMethod === 'QRIS' && (
                    <div className="mt-10 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                       <QrCode size={160} className="text-slate-300" />
                       <p className="mt-4 text-xs font-bold text-slate-400">DUMMY QR CODE FOR SIMULATION</p>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 'SUCCESS' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 mb-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Payment Completed!</h2>
                  <p className="text-slate-500 font-medium mb-10">Transaction has been successfully recorded.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl w-full max-w-sm mb-10 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <ReceiptText size={20} className="text-slate-400" />
                      <span className="font-bold text-slate-800">Transaction Receipt</span>
                    </div>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-bold">{paymentMethod}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-emerald-600 font-black">SUCCESS</span></div>
                       <div className="flex justify-between border-t border-slate-200 pt-2 mt-2"><span className="text-slate-500">Amount Paid</span><span className="font-bold">{formatCurrency(total)}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full max-w-sm">
                    <button 
                      onClick={handlePrintReceipt}
                      className="flex-1 border-2 border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Printer size={18} />
                      Print Receipt
                    </button>
                    <button 
                      onClick={resetPOS}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-slate-200 transition-all"
                    >
                      New Order
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
  <button 
    onClick={onClick}
    className="group flex items-center gap-6 p-6 bg-white border-2 border-slate-100 rounded-3xl text-left transition-all hover:border-indigo-600 hover:bg-indigo-50/30 hover:shadow-xl"
  >
    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-black text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 font-medium">{description}</p>
    </div>
    <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      <Plus size={16} />
    </div>
  </button>
);

export default POS;
