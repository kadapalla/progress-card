import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, PackageOpen, AlertTriangle, CheckCircle2, Search, Plus, X, Video, Check, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';
import { useAppContext } from '../context/AppContext';

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
      toast.error(err.response?.data?.error || 'Failed to upload component');
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

function UploadLectureModal({ isOpen, onClose, onUpload, components, lectures }) {
  const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '', requiredEquipment: [], prerequisites: [] });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lectures`, formData);
      toast.success('Lecture uploaded!');
      onUpload(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload lecture');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id, field) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(id)) return { ...prev, [field]: list.filter(itemId => itemId !== id) };
      return { ...prev, [field]: [...list, id] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-2xl shadow-2xl border-white/20 z-10 mx-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
        <CardHeader><CardTitle>Add New Lecture</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">Title</label><input required className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Video URL (YouTube or MP4)</label><input required className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Description</label><textarea className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-sm font-medium">Required Equipment</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-background/20">
                {components.map(comp => (
                  <Badge 
                    key={comp._id} 
                    variant={formData.requiredEquipment.includes(comp._id) ? 'default' : 'outline'} 
                    className="cursor-pointer" 
                    onClick={() => toggleSelection(comp._id, 'requiredEquipment')}
                  >
                    {comp.name}
                  </Badge>
                ))}
                {components.length === 0 && <span className="text-xs text-muted-foreground">No components available</span>}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-sm font-medium">Prerequisite Lectures</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-background/20">
                {lectures.map(lec => (
                  <Badge 
                    key={lec._id} 
                    variant={formData.prerequisites.includes(lec._id) ? 'default' : 'outline'} 
                    className="cursor-pointer" 
                    onClick={() => toggleSelection(lec._id, 'prerequisites')}
                  >
                    {lec.title}
                  </Badge>
                ))}
                {lectures.length === 0 && <span className="text-xs text-muted-foreground">No lectures available</span>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit" disabled={isLoading}>Save Lecture</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAppContext();
  const [rentals, setRentals] = useState([]);
  const [components, setComponents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLectureUploadOpen, setIsLectureUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(user?.role === 'teacher' ? 'lectures' : 'dashboard');

  useEffect(() => {
    if (user && activeTab === 'dashboard' && user.role === 'teacher') {
      setActiveTab('lectures');
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const promises = [
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/lectures`)
      ];
      
      // If admin, fetch rentals and components
      if (user?.role === 'admin') {
        promises.push(axios.get(`${import.meta.env.VITE_BACKEND_URL}/rentals/active`));
        promises.push(axios.get(`${import.meta.env.VITE_BACKEND_URL}/components`));
      } else {
        promises.push(Promise.resolve({ data: [] }));
        promises.push(Promise.resolve({ data: [] }));
      }

      // Both admin and teacher fetch pending lab requests and students
      if (user?.role === 'admin' || user?.role === 'teacher') {
        promises.push(axios.get(`${import.meta.env.VITE_BACKEND_URL}/lab-requests/pending`));
        promises.push(axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/students`));
      } else {
        promises.push(Promise.resolve({ data: [] }));
        promises.push(Promise.resolve({ data: [] }));
      }

      const [lecturesRes, rentalsRes, compRes, labRequestsRes, studentsRes] = await Promise.all(promises);
      
      setLectures(lecturesRes.data);
      setRentals(rentalsRes.data);
      setComponents(compRes.data);
      setLabRequests(labRequestsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch dashboard data');
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/return/${id}`);
      toast.success('Item marked as returned!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error returning item');
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rentals/${id}/approve`);
      toast.success('Request approved!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error approving request');
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rentals/${id}/reject`);
      toast.success('Request rejected!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error rejecting request');
    }
  };

  const handleDeleteLecture = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/lectures/${id}`);
      toast.success('Lecture deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error deleting lecture');
    }
  };

  const handleActionLabRequest = async (id, action, rejectionReason) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lab-requests/${id}/action`, {
        action,
        rejectionReason
      });
      toast.success(`Request ${action}d successfully!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${action} request`);
    }
  };

  const handleAssignDA = async (studentId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/${studentId}/assign-da`);
      toast.success('User promoted to DA!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign DA role');
    }
  };

  const handleDemoteDA = async (daId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/${daId}/demote-student`);
      toast.success('DA role removed.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to demote user');
    }
  };

  const filteredRentals = rentals.filter(r => {
    const term = search.toLowerCase();
    return r.userId?.name.toLowerCase().includes(term) || r.componentId?.name.toLowerCase().includes(term);
  });

  const activeCount = rentals.filter(r => r.status === 'active').length;
  const pendingCount = rentals.filter(r => r.status === 'pending').length;
  const overdueCount = rentals.filter(r => r.status === 'active' && isPast(new Date(r.dueTime))).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-4 border-b border-white/20 pb-2">
        {user?.role !== 'teacher' && (
          <Button variant={activeTab === 'dashboard' ? 'default' : 'ghost'} onClick={() => setActiveTab('dashboard')}>
            Overview & Rentals
          </Button>
        )}
        <Button variant={activeTab === 'lectures' ? 'default' : 'ghost'} onClick={() => setActiveTab('lectures')}>
          <Video className="mr-2 h-4 w-4" /> Lectures
        </Button>
        <Button variant={activeTab === 'verification' ? 'default' : 'ghost'} onClick={() => setActiveTab('verification')}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Lab Verification
        </Button>
        <Button variant={activeTab === 'users' ? 'default' : 'ghost'} onClick={() => setActiveTab('users')}>
          <Users className="mr-2 h-4 w-4" /> Manage Users
        </Button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-muted-foreground">Monitor inventory and active rentals.</p>
            </div>
            <Button onClick={() => setIsUploadOpen(true)} className="shadow-lg"><Plus className="mr-2 h-4 w-4" /> Upload Component</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Unique Components</CardTitle><PackageOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{components.length}</div></CardContent>
            </Card>
            <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><Users className="h-4 w-4 text-amber-500" /></CardHeader>
              <CardContent><div className="text-2xl font-bold text-amber-500">{pendingCount}</div></CardContent>
            </Card>
            <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Currently Rented</CardTitle><CheckCircle2 className="h-4 w-4 text-green-500" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
            </Card>
            <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Overdue Returns</CardTitle><AlertTriangle className="h-4 w-4 text-destructive" /></CardHeader>
              <CardContent><div className="text-2xl font-bold text-destructive">{overdueCount}</div></CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center bg-muted/20 border-b pb-4">
              <div><CardTitle>Rentals & Requests</CardTitle><CardDescription>Manage currently checked out items and pending requests.</CardDescription></div>
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
                      <TableCell className={isOverdue && rental.status === 'active' ? "text-destructive font-semibold" : ""}>{format(dueTime, 'MMM d, h:mm a')}</TableCell>
                      <TableCell>
                        <Badge variant={rental.status === 'pending' ? 'secondary' : (isOverdue && rental.status === 'active') ? "destructive" : "default"}>
                          {rental.status === 'pending' ? 'Pending' : (isOverdue && rental.status === 'active') ? "Overdue" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        {rental.status === 'pending' ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleApproveRequest(rental._id)} className="text-green-500 border-green-500 hover:bg-green-500/10"><Check className="mr-1 h-4 w-4" /> Approve</Button>
                            <Button variant="outline" size="sm" onClick={() => handleRejectRequest(rental._id)} className="text-destructive border-destructive hover:bg-destructive/10"><XCircle className="mr-1 h-4 w-4" /> Reject</Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleMarkReturned(rental._id)}><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Mark Returned</Button>
                        )}
                      </TableCell>
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
      </>
      )}

      {activeTab === 'lectures' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Manage Lectures</h2>
              <p className="text-muted-foreground">Add new lectures and link required components.</p>
            </div>
            <Button onClick={() => setIsLectureUploadOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Lecture</Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lectures.map(lecture => (
              <Card key={lecture._id} className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-start">
                    {lecture.title}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteLecture(lecture._id)}><X className="h-4 w-4" /></Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lecture.description}</p>
                  <div className="text-sm">
                    <strong>Req Equipment:</strong> {lecture.requiredEquipment?.length || 0} items
                  </div>
                </CardContent>
              </Card>
            ))}
            {lectures.length === 0 && <p className="text-muted-foreground col-span-full">No lectures added yet.</p>}
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Lab Completion Requests</h2>
            <p className="text-muted-foreground">Approve or reject student requests for lab verifications.</p>
          </div>

          <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle>Verification Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Lecture/Lab Title</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No pending requests in your queue.
                      </TableCell>
                    </TableRow>
                  ) : (
                    labRequests.map(req => (
                      <TableRow key={req._id}>
                        <TableCell className="font-medium">{req.studentId?.name}</TableCell>
                        <TableCell>{req.studentId?.studentId || 'N/A'}</TableCell>
                        <TableCell className="font-semibold">{req.lectureId?.title}</TableCell>
                        <TableCell>{format(new Date(req.createdAt), 'MMM d, h:mm a')}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-500 border-green-500 hover:bg-green-500/10"
                            onClick={() => handleActionLabRequest(req._id, 'approve')}
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
                                handleActionLabRequest(req._id, 'reject', reason);
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
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Users & DAs</h2>
            <p className="text-muted-foreground">Assign students as Department Assistants (DAs) once they complete all labs.</p>
          </div>

          <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle>All Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Lab Completion Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map(student => {
                      const completedCount = student.completedLectures?.length || 0;
                      const totalLectures = lectures.length;
                      const hasCompletedAll = completedCount === totalLectures && totalLectures > 0;
                      
                      return (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Badge variant={student.role === 'da' ? 'default' : 'secondary'} className="uppercase">
                              {student.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{completedCount} / {totalLectures}</span>
                              {hasCompletedAll && (
                                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                  All Labs Completed
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {student.role === 'student' ? (
                              <Button
                                size="sm"
                                disabled={!hasCompletedAll}
                                onClick={() => handleAssignDA(student._id)}
                                className={hasCompletedAll ? "bg-primary text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}
                              >
                                Promote to DA
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDemoteDA(student._id)}
                              >
                                Demote to Student
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      <UploadComponentModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={comp => setComponents([...components, comp])} />
      <UploadLectureModal 
        isOpen={isLectureUploadOpen} 
        onClose={() => setIsLectureUploadOpen(false)} 
        onUpload={lec => setLectures([...lectures, lec])} 
        components={components}
        lectures={lectures}
      />
    </div>
  );
}
