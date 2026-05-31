import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { format, isPast } from 'date-fns';
import { Package, Clock, AlertCircle, Check, X } from 'lucide-react';

export default function StudentRentals() {
  const { user } = useAppContext();
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDueRentalId, setEditingDueRentalId] = useState(null);
  const [newDueTime, setNewDueTime] = useState('');
  const [isSavingDue, setIsSavingDue] = useState(false);

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

  const handleSaveDueTime = async (rentalId) => {
    setIsSavingDue(true);
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/rentals/${rentalId}/due-date`, {
        dueTime: newDueTime
      });
      toast.success('Due date updated successfully!');
      setEditingDueRentalId(null);
      
      // Reload rentals
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rentals/user/${user._id}`);
      setRentals(res.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update due date');
    } finally {
      setIsSavingDue(false);
    }
  };

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
              const overdue = isPast(dueTime) && rental.status === 'active';
              return (
                <Card key={rental._id} className="overflow-hidden bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex gap-4 p-4">
                    <img src={rental.componentId?.imageUrl || 'https://via.placeholder.com/150'} alt={rental.componentId?.name} className="h-24 w-24 rounded-lg object-cover bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">{rental.componentId?.name}</h3>
                        <Badge variant={
                          rental.status === 'pending' ? 'secondary' :
                          rental.status === 'rejected' ? 'destructive' :
                          overdue ? 'destructive' : 'default'
                        } className="flex-shrink-0 uppercase text-[9px] px-1.5 py-0.5">
                          {rental.status === 'pending' ? 'Pending' :
                           rental.status === 'rejected' ? 'Rejected' :
                           overdue ? 'Overdue' : 'Active'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Qty: {rental.quantityRented}</p>
                      
                      <div className={`text-xs flex items-center gap-1 mt-2 p-2 rounded-md ${
                        rental.status === 'pending' ? 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400' :
                        rental.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                        overdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {overdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        <span className="font-medium truncate">Due: {format(dueTime, 'MMM d, h:mm a')}</span>
                      </div>

                      {rental.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          {editingDueRentalId === rental._id ? (
                            <div className="flex items-center gap-1 w-full">
                              <input 
                                type="datetime-local" 
                                className="flex-1 bg-background border border-input rounded px-1.5 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
                                value={newDueTime}
                                onChange={e => setNewDueTime(e.target.value)}
                                disabled={isSavingDue}
                              />
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7 text-green-500 border-green-500/30 hover:bg-green-500/10 flex-shrink-0" 
                                onClick={() => handleSaveDueTime(rental._id)}
                                disabled={isSavingDue}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7 text-destructive border-destructive/30 hover:bg-destructive/10 flex-shrink-0" 
                                onClick={() => setEditingDueRentalId(null)}
                                disabled={isSavingDue}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[11px] text-muted-foreground">Adjust due date?</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-[10px] text-primary px-2 hover:bg-primary/10"
                                onClick={() => {
                                  setEditingDueRentalId(rental._id);
                                  setNewDueTime(format(dueTime, "yyyy-MM-dd'T'HH:mm"));
                                }}
                              >
                                Edit
                              </Button>
                            </>
                          )}
                        </div>
                      )}
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
