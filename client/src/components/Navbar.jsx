import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BeakerIcon, ShoppingCart, LogOut, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, cart, setIsCartOpen } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md">
            <BeakerIcon size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            LabManager
          </span>
        </div>
        
        {user && (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === '/admin' ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === '/' ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    Catalog
                  </Link>
                  <Link
                    to="/rentals"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                      location.pathname === '/rentals' ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    <Package className="h-4 w-4" /> My Rentals
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              {user.role === 'student' && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative rounded-full"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cart.length > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              )}
              
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm font-semibold leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
              
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive hover:text-destructive-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
