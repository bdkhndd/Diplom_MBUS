import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Save, ArrowLeft, UploadCloud, Film, 
    Type, AlignLeft, Clock, X, CheckCircle2, Loader2 
} from 'lucide-react';
import { createVideo } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const VideoCreateScreen: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [submitting, setSubmitting] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
    });

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
        if (!videoFile) return alert("Видео файлаа сонгоно уу!");

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('duration', formData.duration);
            data.append('video', videoFile); // Backend: upload.single('video')

            const res = await createVideo(data as any);
            
           
            const newVideo = (res as any).data || res;
            dispatch({ type: 'ADD_VIDEO', payload: newVideo });
            
            alert("Видео амжилттай хадгалагдлаа!");
            navigate('/video'); 
        } catch (err) {
            alert("Алдаа гарлаа. Файлын хэмжээ хэтэрсэн эсвэл сервер ажиллахгүй байна.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
        
            <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-2xl font-black text-slate-500 hover:bg-slate-50">
                    <ArrowLeft className="mr-2 h-5 w-5"/> БУЦАХ
                </Button>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">Шинэ видео заавар нэмэх</h1>
                <div className="w-24"></div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-900 p-8 text-white">
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Film className="text-blue-400 w-6 h-6"/> Видео контент
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {!previewUrl ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        accept="video/*" 
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <UploadCloud className="w-20 h-20 mx-auto text-slate-200 group-hover:text-blue-500 mb-6 transition-colors"/>
                                    <p className="text-xl font-black text-slate-400 group-hover:text-slate-600">ВИДЕО ФАЙЛАА СОНГОНО УУ</p>
                                    <p className="text-sm text-slate-400 mt-2 font-medium">MP4, MOV эсвэл AVI (Макс: 200MB)</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative rounded-[2rem] overflow-hidden aspect-video bg-black shadow-2xl border-4 border-white">
                                        <video src={previewUrl} className="w-full h-full object-contain" controls />
                                        <button 
                                            type="button"
                                            onClick={() => {setPreviewUrl(null); setVideoFile(null);}}
                                            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl active:scale-90"
                                        >
                                            <X className="w-6 h-6"/>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-500"/>
                                            <span className="font-bold text-sm truncate max-w-[300px]">{videoFile?.name}</span>
                                        </div>
                                        <span className="text-xs font-black bg-white px-3 py-1 rounded-lg">{(videoFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

               
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <div className="bg-blue-600 h-2 w-full"></div>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 font-black text-slate-500 text-xs uppercase ml-1">
                                    <Type className="w-4 h-4 text-blue-500"/> Гарчиг
                                </Label>
                                <Input 
                                    placeholder="Зааврын нэр..." 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-700 focus-visible:ring-2 ring-blue-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 font-black text-slate-500 text-xs uppercase ml-1">
                                    <AlignLeft className="w-4 h-4 text-blue-500"/> Тайлбар
                                </Label>
                                <Textarea 
                                    placeholder="Хэрэглэгчдэд зориулсан товч заавар..." 
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="rounded-2xl bg-slate-50 border-none shadow-inner resize-none p-5 font-medium text-slate-600 focus-visible:ring-2 ring-blue-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 font-black text-slate-500 text-xs uppercase ml-1">
                                    <Clock className="w-4 h-4 text-blue-500"/> Хугацаа (Секунд)
                                </Label>
                                <Input 
                                    type="number"
                                    placeholder="Жишээ: 120"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                    className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-black text-slate-700"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={submitting} 
                                className="w-full h-16 rounded-[1.8rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-2xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin"/> ХУУЛЖ БАЙНА...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6"/> ХАДГАЛАХ
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};