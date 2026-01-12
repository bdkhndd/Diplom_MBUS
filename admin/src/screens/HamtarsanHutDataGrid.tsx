import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, MapPin, School, Calendar, Info, Globe, GraduationCap } from 'lucide-react';
import { 
    getHamtarsanHut, 
    getMergejil, 
    deleteHamtarsanHut 
} from '../api/index'; 
import { useAPIActions } from '../context/APIActionContext'; 
import { Button } from '../components/ui/button'; 
import { LoaderOne } from '../components/ui/loader';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../components/ui/table';
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogTitle, AlertDialogTrigger 
} from '../components/ui/alert-dialog';

export const HamtarsanHutDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const hutulburList = state.hamtarsan_hut || [];

    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const res: any = await getHamtarsanHut();
                const actualData = Array.isArray(res) ? res : (res.data || res.hamtarsan_hut || []);
                if (isMounted) dispatch({ type: 'SET_HAMTARSAN_HUT', payload: actualData });

                const mRes: any = await getMergejil();
                const mData = Array.isArray(mRes) ? mRes : (mRes.data || []);
                if (isMounted) dispatch({ type: 'SET_MERGEJIL', payload: mData });
            } catch (err) {
                console.error("Дата ачаалахад алдаа:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchInitialData();
        return () => { isMounted = false; };
    }, [dispatch]);

    const getMergejilName = (mId: any) => {
        if (!mId) return 'Мэргэжил заагаагүй';
        const idToSearch = typeof mId === 'object' ? (mId._id || mId.$oid) : mId;
        const mergejil = state.mergejil.find(m => String(m._id) === String(idToSearch));
        return mergejil ? mergejil.mergejil_Ner : 'Ачаалж байна...';
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteHamtarsanHut(id);
            dispatch({ type: 'DELETE_HAMTARSAN_HUT', payload: id });
        } catch (error) {
            alert("Устгахад алдаа гарлаа.");
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><LoaderOne /></div>;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
        
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
                        <GraduationCap className="text-indigo-600 w-10 h-10" />
                        Хамтарсан хөтөлбөр
                    </h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-[0.2em] text-xs">
                        Нийт {hutulburList.length} бүртгэл байна
                    </p>
                </div>
                <Button 
                    onClick={() => navigate('/hamtarsan_hut/create')}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl shadow-lg shadow-indigo-100 font-bold transition-all active:scale-95"
                >
                    + Шинэ хөтөлбөр нэмэх
                </Button>
            </div>

        
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {hutulburList.length > 0 ? (
                    hutulburList.map((hut, index) => (
                        <div key={hut._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 relative">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{index + 1}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => navigate(`/hamtarsan_hut/edit/${hut._id}`)} className="p-2 text-indigo-400"><Edit3 className="w-4 h-4" /></button>
                                    <DeleteDialog onConfirm={() => handleDelete(hut._id!)} title={hut.surguuli} />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight">{hut.surguuli}</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100">
                                    {getMergejilName(hut.mergejilId)}
                                </span>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-dashed border-gray-100">
                                <div className="flex items-center text-sm text-gray-600"><MapPin className="w-3.5 h-3.5 mr-2 text-orange-400" /> {hut.uls}</div>
                                <div className="flex items-center text-sm text-gray-600"><Calendar className="w-3.5 h-3.5 mr-2 text-blue-400" /> {hut.hutulbur}</div>
                            </div>
                        </div>
                    ))
                ) : <EmptyState />}
            </div>

          
            <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[80px] text-center font-bold text-gray-400">#</TableHead>
                            <TableHead className="font-bold text-gray-700">Сургууль & Улс</TableHead>
                            <TableHead className="font-bold text-gray-700">Хамаарах мэргэжил</TableHead>
                            <TableHead className="font-bold text-gray-700">Хөтөлбөр / Хугацаа</TableHead>
                            <TableHead className="text-right pr-10 font-bold text-gray-700">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hutulburList.length > 0 ? (
                            hutulburList.map((hut, index) => (
                                <TableRow key={hut._id} className="hover:bg-indigo-50/20 transition-colors border-b border-gray-50">
                                    <TableCell className="text-center font-bold text-gray-300">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gray-800">{hut.surguuli}</div>
                                        <div className="text-xs text-gray-400 flex items-center mt-1 uppercase tracking-wider">
                                            <Globe className="w-3 h-3 mr-1" /> {hut.uls}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100">
                                            {getMergejilName(hut.mergejilId)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold text-gray-700">{hut.hutulbur}</div>
                                        <div className="text-xs text-gray-400 mt-1">{hut.hugatsaa}</div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 space-x-2">
                                        <button onClick={() => navigate(`/hamtarsan_hut/edit/${hut._id}`)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <DeleteDialog onConfirm={() => handleDelete(hut._id!)} title={hut.surguuli} isIcon />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={5}><EmptyState /></TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};


const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 w-full">
        <Info className="w-12 h-12 text-gray-200 mb-4" />
        <p className="text-gray-400 font-bold">Одоогоор өгөгдөл бүртгэгдээгүй байна</p>
    </div>
);

const DeleteDialog = ({ onConfirm, title, isIcon = true }: any) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <button className={`p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all`}>
                <Trash2 className={isIcon ? "w-5 h-5" : "w-4 h-4"} />
            </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader>
                <AlertDialogTitle className="font-bold">Устгах уу?</AlertDialogTitle>
                <AlertDialogDescription>"{title}" сургуулийн хөтөлбөрийг бүрмөсөн устгах гэж байна.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-2">
                <AlertDialogCancel className="flex-1 rounded-2xl border-none bg-gray-100">Цуцлах</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 rounded-2xl">Устгая</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);