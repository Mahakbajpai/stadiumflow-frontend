import React, { useState } from 'react';
import { ShoppingBag, Plus, Coffee } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const MENU = [
  { id: 1, name: 'Stadium Burger Combo', price: 15, time: '5m' },
  { id: 2, name: 'Classic Hot Dog', price: 8, time: '2m' },
  { id: 3, name: 'Vegan Bowl', price: 14, time: '7m' },
  { id: 4, name: 'Craft Beer (IPA)', price: 12, time: '1m' },
];

const FoodOrdering = () => {
  const { placeOrder } = useAppContext();
  const [cart, setCart] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
     setCheckingOut(true);
     setTimeout(() => {
        placeOrder(cart, total);
        setCheckingOut(false);
        setSuccess(true);
        setCart([]);
        setTimeout(() => setSuccess(false), 4000);
     }, 1500);
  };

  return (
    <div className="glass-panel p-6">
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center" style={{ width: '36px', height: '36px' }}>
           <span className="material-icons text-[20px]">restaurant</span>
         </div>
         <h3 className="text-lg font-bold text-slate-800">In-Seat Express Order</h3>
       </div>

       <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto mb-6 pr-2">
          {MENU.map(item => (
             <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-100 hover:border-brand-200 rounded-xl shadow-sm transition-colors gap-3 sm:gap-0">
                <div>
                   <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                   <p className="text-xs text-slate-500 mt-1">Est. Prep: {item.time}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                   <span className="font-bold text-slate-700">${item.price}</span>
                   <button 
                      onClick={() => addToCart(item)}
                      className="p-1.5 bg-slate-100 hover:bg-brand hover:text-white text-slate-600 rounded-lg transition-colors"
                      aria-label="Add to cart"
                   >
                      <Plus size={18} />
                   </button>
                </div>
             </div>
          ))}
       </div>

       <div className="border-t border-slate-100 pt-4" data-cart="true">
          <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-medium text-slate-600">Cart ({cart.length})</span>
             <span className="text-lg font-bold text-slate-800">${total.toFixed(2)}</span>
          </div>

          {success ? (
             <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium text-center text-sm animate-fade-in">
                ✅ Order placed! AI optimizing pickup time.
             </div>
          ) : (
             <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkingOut}
                className="w-full py-3 bg-brand hover:bg-brand-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-float"
             >
                {checkingOut ? 'Processing...' : <><ShoppingBag size={18} /> Send to Seat</>}
             </button>
          )}
       </div>
    </div>
  );
};

export default FoodOrdering;
