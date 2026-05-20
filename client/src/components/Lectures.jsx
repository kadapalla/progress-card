import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useAppContext();

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lectures`);
      setLectures(res.data);
      if (res.data.length > 0) setSelectedLecture(res.data[0]);
    } catch (error) {
      console.error('Failed to fetch lectures', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = (equipmentList) => {
    let addedCount = 0;
    equipmentList.forEach(item => {
      if (item.availableQuantity > 0) {
        addToCart(item, 1, 2); // default 1 qty, 2 hours
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} available items to request cart!`);
    } else {
      toast.error('No available items to add.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20 text-muted-foreground">Loading lectures...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Lectures & Experiments</h1>
        <p className="text-muted-foreground">Watch lectures and easily request the required equipment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Available Lectures</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {lectures.map((lecture) => (
              <Card 
                key={lecture._id} 
                className={`cursor-pointer transition-all hover:bg-white/80 dark:hover:bg-slate-900/80 ${selectedLecture?._id === lecture._id ? 'border-primary ring-1 ring-primary shadow-md' : 'bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-white/20'}`}
                onClick={() => setSelectedLecture(lecture)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-primary" /> {lecture.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            {lectures.length === 0 && <p className="text-muted-foreground text-sm">No lectures available.</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedLecture ? (
            <Card className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden animate-in slide-in-from-right-8">
              <div className="aspect-video w-full bg-slate-900 relative">
                {/* Embedded Video placeholder or iframe */}
                {selectedLecture.videoUrl.includes('youtube.com') || selectedLecture.videoUrl.includes('youtu.be') ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedLecture.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                    title={selectedLecture.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video controls className="w-full h-full object-cover">
                    <source src={selectedLecture.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{selectedLecture.title}</CardTitle>
                <p className="text-muted-foreground mt-2">{selectedLecture.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {selectedLecture.prerequisites && selectedLecture.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-500" /> Prerequisites
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLecture.prerequisites.map(prereq => (
                        <Badge key={prereq._id} variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setSelectedLecture(lectures.find(l => l._id === prereq._id) || prereq)}>
                          {prereq.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="font-semibold text-lg">Required Equipment</h3>
                    {selectedLecture.requiredEquipment && selectedLecture.requiredEquipment.length > 0 && (
                      <Button size="sm" onClick={() => handleAddAllToCart(selectedLecture.requiredEquipment)}>
                        Add All to Request
                      </Button>
                    )}
                  </div>
                  
                  {selectedLecture.requiredEquipment && selectedLecture.requiredEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedLecture.requiredEquipment.map(item => (
                        <div key={item._id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs">No img</div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Avail: {item.availableQuantity}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => addToCart(item, 1, 2)} disabled={item.availableQuantity === 0}>
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific equipment required.</p>
                  )}
                </div>

              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] border border-dashed rounded-xl border-white/20 bg-white/10 dark:bg-slate-900/10">
              <p className="text-muted-foreground">Select a lecture to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
