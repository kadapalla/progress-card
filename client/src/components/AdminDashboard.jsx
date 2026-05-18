import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, PackageOpen, AlertTriangle, CheckCircle2, Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';

function UploadComponentModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    name: '', category: '', totalQuantity: 1, availableQuantity: 1, description: '', imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = { ...formData, availableQuantity: formData.totalQuantity };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/components`, data);
      toast.success('Component uploaded!');
      onUpload(res.data);
      onClose();
    } catch (err) {
      toast.error('Failed to upload component');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-lg shadow-2xl border-white/20 z-10 mx-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
        <CardHeader><CardTitle>Upload Component</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Name</label><input required className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label><input required className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Quantity</label><input required type="number" min="1" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.totalQuantity} onChange={e => setFormData({...formData, totalQuantity: parseInt(e.target.value)})} /></div>
              <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Image URL</label><input className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
              <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Description</label><textarea className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-2 pt-4"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit" disabled={isLoading}>Upload</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const [rentals, setRentals] = useState([]);
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rentalsRes, compRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/rentals/active`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/components`)
      ]);
      setRentals(rentalsRes.data);
      setComponents(compRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/return/${id}`);
      toast.success('Item marked as returned!');
      fetchData();
    } catch (err) {
      toast.error('Error returning item');
    }
  };

  const filteredRentals = rentals.filter(r => {
    const term = search.toLowerCase();
    return r.userId?.name.toLowerCase().includes(term) || r.componentId?.name.toLowerCase().includes(term);
  });

  const activeCount = rentals.length;
  const overdueCount = rentals.filter(r => isPast(new Date(r.dueTime))).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor inventory and active rentals.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="shadow-lg"><Plus className="mr-2 h-4 w-4" /> Upload Component</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Unique Components</CardTitle><PackageOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{components.length}</div></CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Items Currently Rented</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Overdue Returns</CardTitle><AlertTriangle className="h-4 w-4 text-destructive" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{overdueCount}</div></CardContent>
        </Card>
      </div>

      <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center bg-muted/20 border-b pb-4">
          <div><CardTitle>Active Rentals</CardTitle><CardDescription>Manage currently checked out items.</CardDescription></div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search student or item..." className="h-9 w-full rounded-full border border-input bg-background/50 pl-9 pr-4 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Item</TableHead><TableHead>Due Time</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredRentals.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No active rentals found.</TableCell></TableRow>
              ) : (
                filteredRentals.map((rental) => {
                  const dueTime = new Date(rental.dueTime);
                  const isOverdue = isPast(dueTime);
                  return (
                    <TableRow key={rental._id}>
                      <TableCell className="font-medium">{rental.userId?.name}</TableCell>
                      <TableCell>{rental.componentId?.name} <span className="text-xs text-muted-foreground">(x{rental.quantityRented})</span></TableCell>
                      <TableCell className={isOverdue ? "text-destructive font-semibold" : ""}>{format(dueTime, 'MMM d, h:mm a')}</TableCell>
                      <TableCell><Badge variant={isOverdue ? "destructive" : "default"}>{isOverdue ? "Overdue" : "Active"}</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleMarkReturned(rental._id)}><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Mark Returned</Button></TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-1 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Quick view of lab components and availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Total Owned</TableHead>
                <TableHead className="text-right">Available Now</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.totalQuantity}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.availableQuantity > 0 ? 'default' : 'destructive'} className="ml-auto">
                      {item.availableQuantity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UploadComponentModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={comp => setComponents([...components, comp])} />
    </div>
  );
}
