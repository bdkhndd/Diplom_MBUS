import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    PlusCircle, Trash2, Edit3, GraduationCap, 
    Percent, BookOpen, Calendar, Search, Eye
} from 'lucide-react';

import { getTetgeleg, getMergejil, deleteTetgeleg } from '../api/index'; 
import { useAPIActions } from '../context/APIActionContext'; 
import { Button } from '../components/ui/button'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LoaderOne } from '../components/ui/loader';
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '../components/ui/alert-dialog'; 
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export const TetgelegDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const tetgelegList = state.tetgeleg || [];
    const mergejilList = state.mergejil || [];

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [tRes, mRes] = await Promise.all([getTetgeleg(), getMergejil()]);
                const tData = (tRes as any).data || tRes;
                const mData = (mRes as any).data || mRes;
                dispatch({ type: 'SET_TETGELEG', payload: tData });
                dispatch({ type: 'SET_MERGEJIL', payload: mData });
            } catch (err) {
                console.error("Дата татахад алдаа гарлаа:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [dispatch]);

    const getMergejilList = (mIds: any) => {
        if (!mIds || (Array.isArray(mIds) && mIds.length === 0)) return ["Бүх мэргэжил"];
        const ids = Array.isArray(mIds) ? mIds : [mIds];
        
        return ids.map(id => {
            const currentId = typeof id === 'object' ? id._id : id;
            const match = mergejilList.find((m: any) => String(m._id) === String(currentId));
            return match ? match.mergejil_Ner : "Тодорхойгүй";
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTetgeleg(id);
            dispatch({ type: 'DELETE_TETGELEG', payload: id });
        } catch (error) {
            console.error("Устгахад алдаа гарлаа:", error);
        }
    };

    const filteredList = tetgelegList.filter((item: any) =>
        item.teteglegNer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="flex h-screen items-center justify-center"><LoaderOne /></div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <GraduationCap className="text-purple-600 w-8 h-8" /> Тэтгэлэгүүд
                    </h1>
                    <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">Нийт {tetgelegList.length} бүртгэл</p>
                </div>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Тэтгэлэгийн нэрээр хайх..." 
                            className="pl-9 h-11 rounded-xl bg-slate-50 border-none shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={() => navigate('/tetgeleg/create')}
                        className="bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl px-6 font-bold"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" /> Шинэ тэтгэлэг
                    </Button>
                </div>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-12 text-center text-slate-400 font-bold">#</TableHead>
                                <TableHead className="font-bold text-slate-700">Тэтгэлэг</TableHead>
                                <TableHead className="font-bold text-slate-700">Мэргэжил</TableHead>
                                <TableHead className="font-bold text-slate-700">Хэмжээ</TableHead>
                                <TableHead className="font-bold text-slate-700">Ангилал / Хугацаа</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 pr-8">Үйлдэл</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredList.map((item: any, index: number) => {
                                const mNames = getMergejilList(item.meregjilId);
                                
                                return (
                                    <TableRow key={item._id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                                        <TableCell className="text-center text-slate-300 font-black">{index + 1}</TableCell>
                                        
                                        <TableCell className="max-w-[250px] py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm">{item.teteglegNer}</span>
                                                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 italic">{item.shaardlag}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-8 rounded-lg bg-purple-50 text-purple-600 font-bold text-[11px] hover:bg-purple-100 border border-purple-100">
                                                        <Eye className="w-3 h-3 mr-1.5" />
                                                        {mNames.length} мэргэжил
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-64 p-3 rounded-2xl shadow-2xl border-none">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2 border-b pb-1">Холбоотой мэргэжлүүд</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {mNames.map((name, i) => (
                                                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] py-0 px-2 font-medium">
                                                                {name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-black text-emerald-600 text-sm flex items-center gap-1">
                                                {item.teteglegiin_Hemjee && String(item.teteglegiin_Hemjee).length > 4 
                                                    ? `${String(item.teteglegiin_Hemjee).substring(0, 4)}..` 
                                                    : item.teteglegiin_Hemjee}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {item.hugatsaa}
                                                </span>
                                                <Badge className="w-fit text-[9px] bg-blue-50 text-blue-600 border-none mt-1 py-0 px-1.5 uppercase font-black">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" size="icon" 
                                                    onClick={() => navigate(`/tetgeleg/edit/${item._id}`)}
                                                    className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2rem]">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="font-black">Устгахдаа итгэлтэй байна уу?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-slate-500">
                                                                Энэ үйлдлийг буцаах боломжгүй бөгөөд системээс бүрмөсөн устах болно.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl font-bold">Цуцлах</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(item._id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
                                                            >
                                                                Тийм, устга
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};