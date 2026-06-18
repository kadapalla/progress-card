import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { X, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CheckoutModal({ item, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [hours, setHours] = useState(1);
  const { addToCart } = useAppContext();

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(item, quantity, hours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-md shadow-2xl border-white/20 z-10 mx-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardHeader>
          <CardTitle>Add to Request</CardTitle>
          <CardDescription>Select quantity and duration for {item.name}.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none">
              Quantity (Max: {item.availableQuantity})
            </label>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(Math.min(item.availableQuantity, quantity + 1))}
                disabled={quantity >= item.availableQuantity}
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              <Clock className="h-4 w-4" /> Rental Duration (Hours)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-bold w-12 text-right">{hours} hr{hours > 1 ? 's' : ''}</span>
            </div>
          </div>

        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add to Request</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
