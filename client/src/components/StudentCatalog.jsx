import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Cpu, Search } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function StudentCatalog() {
  const [components, setComponents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/components');
        setComponents(res.data);
      } catch (error) {
        console.error('Failed to fetch components', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const filteredComponents = components.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Component Catalog</h1>
          <p className="text-muted-foreground">Browse and add items to your cart for hourly rentals.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search components or categories..."
            className="h-10 w-full rounded-full border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md pl-9 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-muted-foreground">Loading components...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredComponents.map((item) => (
            <Card key={item._id} className="flex flex-col bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                {item.availableQuantity === 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Badge variant="destructive" className="text-sm shadow-lg">Out of Stock</Badge>
                  </div>
                )}
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Cpu className="h-16 w-16 text-muted-foreground/30" />
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
                <Button 
                  size="sm" 
                  className="rounded-full shadow-md"
                  onClick={() => setSelectedItem({ ...item, id: item._id })}
                  disabled={item.availableQuantity === 0}
                >
                  Add to Cart
                </Button>
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
    </div>
  );
}
