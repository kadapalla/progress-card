import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export default function CheckoutOverview() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-muted-foreground">No checkout data found.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-500">
      <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">Request Submitted!</CardTitle>
            <p className="text-muted-foreground mt-2">Your request is pending admin approval.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Overview of Requested Items</h3>
          <div className="space-y-4">
            {items.map((item, idx) => {
              const due = new Date();
              due.setHours(due.getHours() + item.hours);
              
              return (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.item.imageUrl || 'https://via.placeholder.com/150'} alt={item.item.name} className="w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{item.item.name} <span className="text-muted-foreground">x{item.quantity}</span></h4>
                      <p className="text-sm text-muted-foreground">{item.item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Clock className="h-4 w-4" />
                      <span>{item.hours} Hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-8 border-t border-white/10">
          <Button size="lg" onClick={() => navigate('/')} className="px-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
