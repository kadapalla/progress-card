import { useAppContext } from '../context/AppContext';
import { X, Minus, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CartDrawer() {
  const { cart, removeFromCart, addToCart, isCartOpen, setIsCartOpen, user, clearCart } = useAppContext();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      setIsCartOpen(false);
      return;
    }

    setIsProcessing(true);
    try {
      const items = cart.map(c => ({ componentId: c.componentId, quantity: c.quantity, hours: c.hours }));
      await axios.post('http://localhost:5000/api/checkout', { userId: user._id, items });
      
      clearCart();
      setIsCartOpen(false);
      navigate('/checkout-overview', { state: { items: cart } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />
      
      <div className="relative w-full max-w-md h-full bg-card shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
              <Clock className="h-16 w-16 mb-4" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.componentId} className="flex gap-4 p-4 rounded-xl border bg-background/50 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  onClick={() => removeFromCart(item.componentId)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.item.imageUrl || 'https://via.placeholder.com/150'} alt={item.item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium line-clamp-1">{item.item.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.hours} Hour{item.hours > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => addToCart(item.item, -1, item.hours)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => addToCart(item.item, 1, item.hours)}
                        disabled={item.quantity >= item.item.availableQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-muted/20 backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-medium">{cart.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
            </div>
            <Button 
              className="w-full shadow-lg" 
              size="lg" 
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? 'Processing...' : 'Confirm Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
