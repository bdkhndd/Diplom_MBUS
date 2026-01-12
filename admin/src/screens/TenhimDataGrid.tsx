import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Building2, Award, Info, X, Star, BookOpen } from 'lucide-react';
import { getTenhim, deleteTenhim } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";

const IMAGE_BASE_URL = 'http://192.168.1.3:4000';

type DetailType = 'tailbar' | 'shagnal' | 'chiglel' | 'buteel';

const TenhimDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const navigate = useNavigate();
    const tenhimList = state.tenhim ?? [];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTenhim();
                dispatch({ type: 'SET_TENHIM', payload: res });
            } catch (err) {
                console.error('Алдаа:', err);
            } finally {
                setIsLoading(false);
            }
        };
        if (tenhimList.length === 0) fetchData();
        else setIsLoading(false);
    }, [dispatch, tenhimList.length]);

    const handleDelete = async (id: string) => {
        try {
            await deleteTenhim(id);
            dispatch({ type: 'DELETE_TENHIM', payload: id });
        } catch (err) {
            alert('Устгахад алдаа гарлаа');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                        <Building2 className="w-6 h-6 md:w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Тэнхимийн Удирдлага</h1>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Нийт {tenhimList.length} тэнхим</p>
                    </div>
                </div>
                <Button onClick={() => navigate('/tenhim/create')} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-lg font-bold">
                    <Plus className="w-5 h-5 mr-2" /> Шинэ тэнхим нэмэх
                </Button>
            </div>

            <div className="hidden xl:block bg-white rounded-2xl shadow-xl border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead className="w-40">Зураг</TableHead>
                            <TableHead className="w-56">Тэнхим / Тайлбар</TableHead>
                            <TableHead>Тэргүүлэх чиглэл</TableHead>
                            <TableHead>Бүтээлүүд</TableHead>
                            <TableHead>Шагнал</TableHead>
                            <TableHead className="text-right pr-6">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenhimList.map((t, idx) => (
                            <TableRow key={t._id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-center font-medium text-slate-400">{idx + 1}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {[0, 1].map((i) => (
                                            <div key={i} className="w-16 h-12 rounded border overflow-hidden bg-slate-100 shrink-0">
                                                {t.zurag?.[i] ? <img src={`${IMAGE_BASE_URL}${t.zurag[i]}`} className="w-full h-full object-cover" alt="img" /> : null}
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-800 line-clamp-1">{t.ner}</p>
                                        <Dialog>
                                            <DialogTrigger asChild><button className="text-[10px] text-indigo-600 font-bold hover:underline">Тайлбар харах</button></DialogTrigger>
                                            <DetailCard data={t} showType="tailbar" />
                                        </Dialog>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[150px]">
                                       
                                        <p className="text-xs text-slate-600 line-clamp-2 italic">{t.tergvvleh_chiglel || "Байхгүй"}</p>
                                        <Dialog>
                                            <DialogTrigger asChild><button className="text-[10px] text-blue-600 font-bold hover:underline">Дэлгэрэнгүй</button></DialogTrigger>
                                            <DetailCard data={t} showType="chiglel" />
                                        </Dialog>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[150px]">
                                       
                                        <p className="text-xs text-slate-600 line-clamp-2 italic">{t.bvteel || "Байхгүй"}</p>
                                        <Dialog>
                                            <DialogTrigger asChild><button className="text-[10px] text-purple-600 font-bold hover:underline">Бүтээл харах</button></DialogTrigger>
                                            <DetailCard data={t} showType="buteel" />
                                        </Dialog>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[150px]">
                                        <p className="text-xs text-green-700 font-semibold line-clamp-2">{t.shagnal || "Байхгүй"}</p>
                                        <Dialog>
                                            <DialogTrigger asChild><button className="text-[10px] text-green-600 font-bold hover:underline">Шагнал харах</button></DialogTrigger>
                                            <DetailCard data={t} showType="shagnal" />
                                        </Dialog>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-4">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => navigate(`/tenhim/edit/${t._id}`)} className="text-indigo-600"><Pencil className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => t._id && handleDelete(t._id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenhimList.map((t, idx) => (
                    <div key={t._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{t.ner}</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/tenhim/edit/${t._id}`)} className="h-8 w-8 p-0 text-indigo-600"><Pencil className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => t._id && handleDelete(t._id)} className="h-8 w-8 p-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Dialog><DialogTrigger asChild><Button variant="outline" className="text-[10px] h-8 rounded-lg">Тайлбар</Button></DialogTrigger><DetailCard data={t} showType="tailbar" /></Dialog>
                            <Dialog><DialogTrigger asChild><Button variant="outline" className="text-[10px] h-8 rounded-lg border-blue-100 text-blue-600">Чиглэл</Button></DialogTrigger><DetailCard data={t} showType="chiglel" /></Dialog>
                            <Dialog><DialogTrigger asChild><Button variant="outline" className="text-[10px] h-8 rounded-lg border-purple-100 text-purple-600">Бүтээл</Button></DialogTrigger><DetailCard data={t} showType="buteel" /></Dialog>
                            <Dialog><DialogTrigger asChild><Button variant="outline" className="text-[10px] h-8 rounded-lg border-green-100 text-green-600">Шагнал</Button></DialogTrigger><DetailCard data={t} showType="shagnal" /></Dialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DetailCard = ({ data, showType }: { data: any, showType: DetailType }) => {
   
    const config = {
        tailbar: { title: 'Тэнхимийн тайлбар', icon: <Info className="w-8 h-8" />, color: 'from-indigo-600 to-purple-800', badge: 'bg-orange-500', field: data.tailbar },
        shagnal: { title: 'Амжилт & Шагнал', icon: <Award className="w-8 h-8" />, color: 'from-emerald-600 to-teal-800', badge: 'bg-green-500', field: data.shagnal },
        chiglel: { title: 'Тэргүүлэх чиглэл', icon: <Star className="w-8 h-8" />, color: 'from-blue-600 to-cyan-800', badge: 'bg-blue-500', field: data.tergvvleh_chiglel },
        buteel: { title: 'Эрдэм шинжилгээний бүтээл', icon: <BookOpen className="w-8 h-8" />, color: 'from-purple-600 to-pink-800', badge: 'bg-purple-500', field: data.bvteel },
    }[showType];

    return (
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:max-w-[600px] p-0 border-none shadow-2xl bg-white flex flex-col h-[70vh] max-h-[85vh] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden [&>button]:hidden">
            <DialogClose className="absolute right-4 top-4 z-[100] rounded-full p-2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all outline-none border border-white/30">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </DialogClose>

            <div className={`bg-gradient-to-br ${config.color} p-6 sm:p-8 text-white shrink-0`}>
                <div className="flex items-center gap-4 sm:gap-5 pr-8">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/20 hidden sm:block shrink-0">
                        {config.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <DialogTitle className="text-lg sm:text-xl font-black text-white leading-tight break-words line-clamp-2">
                            {data.ner}
                        </DialogTitle>
                        <Badge className={`${config.badge} text-white border-none px-2 py-0.5 mt-2 text-[9px] font-bold uppercase tracking-widest`}>
                            {config.title}
                        </Badge>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 min-h-0 scrollbar-thin scrollbar-thumb-indigo-200">
                <div className="bg-white p-5 sm:p-8 rounded-[1.2rem] sm:rounded-[2rem] shadow-sm border border-slate-100 min-h-full">
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base italic whitespace-pre-wrap font-medium">
                        {config.field || "Мэдээлэл байхгүй байна."}
                    </p>
                </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
                <DialogClose asChild>
                    <Button variant="secondary" className="w-full sm:w-auto rounded-xl px-10 font-bold hover:bg-slate-100 h-10 sm:h-11 shadow-sm">
                        Хаах
                    </Button>
                </DialogClose>
            </div>
        </DialogContent>
    );
};

export default TenhimDataGrid;