import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Save, ArrowLeft, UploadCloud, Film, 
    Type, AlignLeft, Clock, X, CheckCircle2, Loader2, AlertCircle 
} from 'lucide-react';
import { getVideoById, updateVideo } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const VideoEditScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
    });

  
    useEffect(() => {
        const fetchVideo = async () => {
            if (!id) return;
            try {
                const res = await getVideoById(id);
                const data = (res as any).data || res;
                setFormData({
                    title: data.title,
                    description: data.description || '',
                    duration: data.duration.toString(),
                });
                setExistingVideoUrl(`${import.meta.env.VITE_API_URL}/${data.videoUrl}`);
            } catch (err) {
                alert("Өгөгдөл татахад алдаа гарлаа.");
                navigate('/video');
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('duration', formData.duration);
            
           
            if (videoFile) {
                data.append('video', videoFile);
            }

            const res = await updateVideo(id, data);
            const updatedVideo = (res as any).data || res;
            
            dispatch({ type: 'UPDATE_VIDEO', payload: updatedVideo });
            
            alert("Амжилттай шинэчлэгдлээ!");
            navigate('/video');
        } catch (err) {
            alert("Хадгалахад алдаа гарлаа.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600"/>
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
     
            <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-2xl font-black text-slate-500 hover:bg-slate-50">
                    <ArrowLeft className="mr-2 h-5 w-5"/> БУЦАХ
                </Button>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">Видео заавар засах</h1>
                <div className="w-24"></div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-900 p-8 text-white">
                            <CardTitle className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-widest">
                                <Film className="text-blue-400 w-6 h-6"/> Видео файл солих
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                           
                            <div className="relative rounded-[2rem] overflow-hidden aspect-video bg-black shadow-2xl border-4 border-white">
                                <video 
                                    key={previewUrl || existingVideoUrl}
                                    src={(previewUrl || existingVideoUrl) + "#t=0.1"} 
                                    className="w-full h-full object-contain" 
                                    controls 
                                />
                                {videoFile && (
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-xl animate-pulse">
                                        ШИНЭ ФАЙЛ СОНГОГДЛОО
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="outline"
                                    className="h-16 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 font-bold text-slate-500"
                                >
                                    <UploadCloud className="mr-2 h-5 w-5"/> ӨӨР ВИДЕО СОНГОХ
                                </Button>
                                <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileChange} className="hidden" />
                                
                                {!videoFile && (
                                    <p className="flex items-center gap-2 text-xs text-slate-400 font-medium ml-2">
                                        <AlertCircle className="w-4 h-4"/> Хэрэв видеог солихгүй бол хэвээр үлдэнэ.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <div className="bg-orange-500 h-2 w-full"></div>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-500 text-xs uppercase ml-1">Гарчиг</Label>
                                <Input 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="font-black text-slate-500 text-xs uppercase ml-1">Тайлбар</Label>
                                <Textarea 
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="rounded-2xl bg-slate-50 border-none resize-none p-5 font-medium text-slate-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="font-black text-slate-500 text-xs uppercase ml-1">Хугацаа (Сек)</Label>
                                <Input 
                                    type="number"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                    className="h-14 rounded-2xl bg-slate-50 border-none font-black text-slate-700"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={submitting} 
                                className="w-full h-16 rounded-[1.8rem] bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-2xl shadow-orange-100 transition-all active:scale-95"
                            >
                                {submitting ? <Loader2 className="animate-spin"/> : "ӨӨРЧЛӨЛТ ХАДГАЛАХ"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};