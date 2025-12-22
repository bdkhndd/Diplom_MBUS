import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Шилжилт хийхэд хэрэгтэй
import { Pencil, Trash2, Plus, DollarSign, Wallet, LayoutGrid } from 'lucide-react';
import { getTulbur, deleteTulbur } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

const TulburDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const navigate = useNavigate(); // 2. Navigate хувьсагч зарлах
    const tulburList = state.tulbur ?? [];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTulbur();
                dispatch({ type: 'SET_TULBUR', payload: res });
            } catch (err) {
                console.error('Failed to fetch Tulbur:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (tulburList.length === 0) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [dispatch, tulburList.length]);

    const handleDelete = async (id: string) => {
        try {
            await deleteTulbur(id);
            dispatch({ type: 'DELETE_TULBUR', payload: id });
        } catch (err) {
            alert('Устгахад алдаа гарлаа');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-500 font-medium">Төлбөрийн мэдээлэл ачаалж байна...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Header хэсэг - Тэнхимийн жишээ шиг загвартай */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                        <Wallet className="w-6 h-6 md:w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Төлбөрийн Удирдлага</h1>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Нийт {tulburList.length} тохиргоо</p>
                    </div>
                </div>
                {/* 3. "Шинэ нэмэх" товч дээр navigate холбосон */}
                <Button 
                    onClick={() => navigate('/tulbur/create')} 
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 shadow-lg font-bold"
                >
                    <Plus className="w-5 h-5 mr-2" /> Шинэ Төлбөр Нэмэх
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead>Тэргүүлэх Эрэлттэй</TableHead>
                            <TableHead>Бусад Мэргэжил</TableHead>
                            <TableHead>Кредитийн задаргаа</TableHead>
                            <TableHead className="text-right pr-6">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tulburList.length > 0 ? (
                            tulburList.map((t, idx) => (
                                <TableRow key={t._id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-center font-medium text-slate-400">{idx + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{t.terguuleh_erelttei?.tulbur?.toLocaleString()} {t.terguuleh_erelttei?.negj_temdeg}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.terguuleh_erelttei?.meregjilId?.length || 0} мэргэжил</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{t.busad_mergejil?.tulbur?.toLocaleString()} {t.busad_mergejil?.negj_temdeg}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.busad_mergejil?.meregjilId?.length || 0} мэргэжил</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Заавал: {t.tulburiin_zadargaa?.zaawlSudlah_kredit}
                                            </p>
                                            <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Сонгон: {t.tulburiin_zadargaa?.songonSudlah_kredit}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end gap-1">
                                            {/* 4. "Засах" товч дээр navigate холбосон */}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => navigate(`/tulbur/edit/${t._id}`)} 
                                                className="text-purple-600 hover:bg-purple-50"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Устгах уу?</AlertDialogTitle>
                                                        <AlertDialogDescription>Төлбөрийн мэдээллийг бүрмөсөн устгах гэж байна.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-xl">Үгүй</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(t._id!)} className="bg-red-600 rounded-xl hover:bg-red-700">Тийм</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-gray-400 font-medium">
                                    Төлбөрийн мэдээлэл олдсонгүй
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TulburDataGrid;