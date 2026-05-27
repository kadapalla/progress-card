import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { format, isPast } from 'date-fns';
import { Package, Clock, AlertCircle } from 'lucide-react';

export default function StudentRentals() {
  const { user } = useAppContext();
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rentals/user/${user._id}`);
        setRentals(res.data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        toast.error(error.response?.data?.error || 'Failed to load rentals');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchRentals();
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading your rentals...</div>;
  }

  const activeRentals = rentals.filter(r => r.status !== 'returned');
  const pastRentals = rentals.filter(r => r.status === 'returned');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
        <p className="text-muted-foreground">Track your active and past equipment rentals.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Active Rentals ({activeRentals.length})
        </h2>
        
        {activeRentals.length === 0 ? (
          <Card className="bg-white/40 dark:bg-slate-950/40 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-4 opacity-50" />
              <p>You have no active rentals.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRentals.map((rental) => {
              const dueTime = new Date(rental.dueTime);
              const overdue = isPast(dueTime) && rental.status !== 'returned';
              return (
                <Card key={rental._id} className="overflow-hidden bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex gap-4 p-4">
                    <img src={rental.componentId?.imageUrl || 'https://via.placeholder.com/150'} alt={rental.componentId?.name} className="h-24 w-24 rounded-lg object-cover bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold line-clamp-2">{rental.componentId?.name}</h3>
                        <Badge variant={overdue ? 'destructive' : 'default'}>{overdue ? 'Overdue' : 'Active'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Qty: {rental.quantityRented}</p>
                      
                      <div className={`text-sm flex items-center gap-1 mt-2 p-2 rounded-md ${overdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {overdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        <span className="font-medium">Due: {format(dueTime, 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {pastRentals.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold text-muted-foreground">Past Rentals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-80 grayscale-[30%]">
            {pastRentals.map((rental) => (
              <Card key={rental._id} className="bg-transparent border border-white/10">
                <div className="p-4 flex items-center gap-3">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm">{rental.componentId?.name}</h4>
                    <p className="text-xs text-muted-foreground">Returned: {format(new Date(rental.returnTime), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
