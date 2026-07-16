import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Cpu, Search, X } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

function RentersModal({ item, onClose }) {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item) {
      axios.get(`/components/${item._id}/renters`)
        .then(res => setRenters(res.data))
        .catch(err => {
          console.error(err);
          toast.error(err.response?.data?.error || 'Failed to load renters information');
        })
        .finally(() => setLoading(false));
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-md shadow-2xl border-white/20 z-10 mx-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
        <CardHeader>
          <CardTitle>Current Renters for {item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : renters.length === 0 ? (
            <p className="text-muted-foreground">No active renters found.</p>
          ) : (
            <ul className="space-y-2">
              {renters.map(r => (
                <li key={r._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded-md bg-muted/50 gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{r.userId?.name}</span>
                    <span className="text-xs text-muted-foreground">{r.userId?.email}</span>
                  </div>
                  <Badge variant="secondary">Qty: {r.quantityRented}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentCatalog() {
  const [components, setComponents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [rentersModalItem, setRentersModalItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Microcontrollers', 'Sensors', 'Displays', 'Power', 'Connectivity', 'Motors', 'Cables', 'Tools', 'Breadboards', 'Components', 'Other'];

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axios.get(`/components`);
        setComponents(res.data);
      } catch (error) {
        console.error('Failed to fetch components', error);
        toast.error(error.response?.data?.error || 'Failed to fetch components');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const filteredComponents = components.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Component Catalog</h1>
          <p className="text-muted-foreground">Browse and add items to your cart for hourly rentals.</p>
        </div>
        
        <div className="flex gap-2 items-center w-full md:w-auto flex-col sm:flex-row">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 w-full sm:w-auto rounded-full border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="text-foreground bg-background">{cat}</option>
            ))}
          </select>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              className="h-10 w-full rounded-full border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md pl-9 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-muted-foreground">Loading components...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredComponents.map((item) => (
            <Card key={item._id} className="flex flex-col bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/40 shadow-lg hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_12px_30px_rgba(56,189,248,0.1)] hover:-translate-y-2 hover:border-indigo-500/30 dark:hover:border-sky-500/30 transition-all duration-300 group overflow-hidden glass-glow-card">
              <div className="aspect-video w-full bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center relative overflow-hidden border-b border-slate-100 dark:border-slate-850/40">
                {item.availableQuantity === 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Badge variant="destructive" className="text-sm shadow-lg">Out of Stock</Badge>
                  </div>
                )}
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                ) : (
                  <Cpu className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-700 ease-out" />
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                </div>
                <Badge variant="secondary" className="w-fit">{item.category}</Badge>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-white/10 mt-4 gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Avail: </span>
                  <span className={item.availableQuantity > 0 ? "font-bold text-green-600 dark:text-green-400" : "font-bold text-destructive"}>
                    {item.availableQuantity}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">/ {item.totalQuantity}</span>
                </div>
                {item.availableQuantity === 0 ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-full shadow-md border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setRentersModalItem(item)}
                  >
                    Who is renting?
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="rounded-full shadow-md"
                    onClick={() => setSelectedItem({ ...item, id: item._id })}
                  >
                    Add to Request
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No components found matching your search.</p>
        </div>
      )}

      {selectedItem && (
        <CheckoutModal 
          item={selectedItem} 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {rentersModalItem && (
        <RentersModal 
          item={rentersModalItem} 
          onClose={() => setRentersModalItem(null)} 
        />
      )}
    </div>
  );
}
