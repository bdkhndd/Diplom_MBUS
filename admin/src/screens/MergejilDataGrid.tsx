import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, GraduationCap, Clock, BookOpen, Target, Info, Hash } from 'lucide-react';
import { getMergejil, deleteMergejil, getTenhim, type MergejilType, type TenhimType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const MergejilDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const navigate = useNavigate();
    const mergejilList = state.mergejil ?? [];
    const [tenhimList, setTenhimList] = useState<TenhimType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [m, t] = await Promise.all([getMergejil(), getTenhim()]);
                dispatch({ type: 'SET_MERGEJIL', payload: m });
                setTenhimList(t);
            } catch (err) { console.error(err); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Устгахдаа итгэлтэй байна уу?")) return;
        try {
            await deleteMergejil(id);
            dispatch({ type: 'DELETE_MERGEJIL', payload: id });
        } catch (err) { alert('Алдаа гарлаа'); }
    };

    if (isLoading) return <div className="p-20 text-center animate-pulse text-indigo-600 font-bold">Ачаалж байна...</div>;

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Мэргэжлийн хөтөлбөр</h1>
                        <p className="text-sm text-gray-400 font-medium">Нийт {mergejilList.length} хөтөлбөр бүртгэлтэй байна</p>
                    </div>
                </div>
                <Button onClick={() => navigate('/mergejil/create')} className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg h-11 px-6">
                    <Plus className="w-5 h-5 mr-2" /> Шинэ мэргэжил нэмэх
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow>
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead className="w-64">Мэргэжил ба Код</TableHead>
                            <TableHead>Хамаарах Тэнхим</TableHead>
                            <TableHead className="w-48">Хөтөлбөрийн үзүүлэлт</TableHead>
                            <TableHead>Хичээлүүд & Тайлбар</TableHead>
                            <TableHead className="text-right pr-6">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mergejilList.map((m, idx) => (
                            <TableRow key={m._id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-center font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-slate-900 text-sm">{m.mergejil_Ner}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Hash size={10} className="text-indigo-400" />
                                        <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">{m.mergejil_Kod}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-slate-600 bg-slate-100/50 px-3 py-1 rounded-lg inline-block">
                                        {typeof m.tenhimId === 'object' ? m.tenhimId?.ner : tenhimList.find(t => t._id === m.tenhimId)?.ner || '---'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <BookOpen size={12} className="text-blue-500" />
                                            <span className="font-semibold">{m.sudlah_kredit} Кредит</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Clock size={12} className="text-orange-500" />
                                            <span>{m.suraltsah_hugatsaa} суралцах</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Target size={12} className="text-emerald-500" />
                                            <span className="font-bold text-emerald-700">Босго: {m.minScore} оноо</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-md space-y-3">
                                        {/* Хичээлүүд */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {m.hicheeluud?.slice(0, 4).map((h, i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] font-medium bg-white border-slate-200 text-slate-600">
                                                    {h.name}
                                                </Badge>
                                            ))}
                                            {(m.hicheeluud?.length ?? 0) > 4 && (
                                                <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                                                    +{m.hicheeluud!.length - 4}
                                                </span>
                                            )}
                                        </div>
                                        {/* Тайлбар */}
                                        {m.tailbar && (
                                            <div className="flex gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-slate-500 italic leading-relaxed line-clamp-2">
                                                    {m.tailbar}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-4">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => navigate(`/mergejil/edit/${m._id}`)} className="h-9 w-9 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => m._id && handleDelete(m._id)} className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {mergejilList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                                    Мэдээлэл олдсонгүй
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MergejilDataGrid;