import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Pencil, Trash2, Plus, Play, Clock, 
    Eye, Loader2, Video, Search, ChevronRight 
} from 'lucide-react';
import { getVideo, deleteVideo, type VideoType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from "../components/ui/videoCard";
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, 
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '../components/ui/alert-dialog';

export const VideoDataGrid: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAPIActions();
    const videoList = state.video ?? [];
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await getVideo();
                // Backend-ээс { data: [...] } хэлбэрээр ирж байгаа бол
                const data = (res as any).data || res;
                dispatch({ type: 'SET_VIDEO', payload: data });
            } catch (error) {
                console.error("Дата уншихад алдаа гарлаа:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideos();
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        try {
            await deleteVideo(id);
            dispatch({ type: 'DELETE_VIDEO', payload: id });
        } catch (error) {
            alert("Устгахад алдаа гарлаа.");
        }
    };

    // Хайлт хийх логик
    const filteredVideos = videoList.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="font-black text-slate-400 uppercase tracking-widest">Түр хүлээнэ үү...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header Хэсэг */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
                        <Video className="text-blue-600 w-8 h-8"/> Видео зааварчилгаа
                    </h1>
                    <p className="text-slate-400 font-bold text-sm uppercase ml-1">Нийт {videoList.length} контент бүртгэгдсэн</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input 
                            placeholder="Заавар хайх..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold"
                        />
                    </div>
                    <Button 
                        onClick={() => navigate('/video/create')} 
                        className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 font-black h-14 shadow-xl shadow-blue-100 transition-all active:scale-95"
                    >
                        <Plus className="mr-2 h-6 w-6" /> Видео үүсгэх
                    </Button>
                </div>
            </div>

            {/* Grid Хэсэг */}
            {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((v) => (
                        <Card key={v._id} className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/40 overflow-hidden bg-white group hover:-translate-y-2 transition-all duration-300">
                            {/* Видео Превью (Thumbnail-гүй үед #t=0.1 ашиглана) */}
                            <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                <video 
                                    src={`${import.meta.env.VITE_API_URL}/${v.videoUrl}#t=0.1`} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    preload="metadata"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                        <Play className="w-8 h-8 text-white fill-white" />
                                    </div>
                                </div>
                                
                                <Badge className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-full px-4 py-1.5 text-xs">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400"/> {v.duration} СЕК
                                </Badge>
                            </div>
                            
                            <CardContent className="p-8 space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{v.title}</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"/>
                                </div>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed min-h-[40px]">{v.description || "Тайлбар ороогүй..."}</p>
                            </CardContent>

                            <CardFooter className="p-8 pt-0 flex gap-3">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-2xl font-black h-12 border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
                                    onClick={() => navigate(`/video/edit/${v._id}`)}
                                >
                                    <Pencil className="w-4 h-4 mr-2 text-blue-500"/> ЗАСАХ
                                </Button>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="rounded-2xl h-12 w-12 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                                            <Trash2 className="w-5 h-5"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-[2.5rem] border-none p-10 shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl font-black text-slate-800 uppercase">Устгах уу?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-500 font-medium text-lg leading-relaxed">
                                                "{v.title}" зааварчилгааг системээс бүрмөсөн устгах гэж байна.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-8 gap-3">
                                            <AlertDialogCancel className="rounded-2xl h-14 font-black border-none bg-slate-100 px-8">ҮГҮЙ</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDelete(v._id!)} 
                                                className="bg-red-500 hover:bg-red-600 rounded-2xl h-14 font-black shadow-xl shadow-red-100 px-8"
                                            >
                                                ТИЙМ, УСТГА
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Video className="w-16 h-16 text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Контент олдсонгүй</p>
                </div>
            )}
        </div>
    );
};