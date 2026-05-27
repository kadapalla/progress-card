import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function VerifyLabs() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lab-requests/pending`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action, rejectionReason) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lab-requests/${id}/action`, {
        action,
        rejectionReason
      });
      toast.success(`Lab request ${action}d successfully!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${action} request`);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading verification queue...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" /> DA Lab Verification Queue
        </h1>
        <p className="text-muted-foreground">Review and action pending lab completion requests from students.</p>
      </div>

      <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <CardTitle className="text-lg">Pending Lab Verifications ({requests.length})</CardTitle>
          <CardDescription>Verify circuit builds or code completion as requested by students.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Lecture/Lab Title</TableHead>
                <TableHead>Requested Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
                    No pending verification requests in your queue.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell className="font-semibold">{req.studentId?.name}</TableCell>
                    <TableCell>{req.studentId?.studentId || 'N/A'}</TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                      {req.lectureId?.title}
                    </TableCell>
                    <TableCell>{format(new Date(req.createdAt), 'MMM d, h:mm a')}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-500 border-green-500 hover:bg-green-500/10"
                        onClick={() => handleAction(req._id, 'approve')}
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const reason = window.prompt('Enter rejection reason (optional):');
                          if (reason !== null) {
                            handleAction(req._id, 'reject', reason);
                          }
                        }}
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
