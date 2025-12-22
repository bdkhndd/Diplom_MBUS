import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ChevronLeft, Save, GraduationCap, 
    Calendar, BookOpen, Loader2, Edit, X
} from 'lucide-react';

import { getTetgelegById, updateTetgeleg, getMergejil } from '../api/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const TetgelegEditScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mergejilList, setMergejilList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        teteglegNer: '',
        shaardlag: '',
        meregjilId: [] as string[], // Талбарын нэр: meregjilId
        teteglegiin_Hemjee: '',
        bosgo_Onoo: '',
        hugatsaa: '',
        category: 'Surguuli'
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const [tRes, mRes] = await Promise.all([
                    getTetgelegById(id),
                    getMergejil()
                ]);

                const tetgelegData = (tRes as any).data || tRes;
                const mData = (mRes as any).data || mRes;

                setMergejilList(Array.isArray(mData) ? mData : []);

                // Засах өгөгдлийг State-д оноох
                setFormData({
                    teteglegNer: tetgelegData.teteglegNer || '',
                    shaardlag: tetgelegData.shaardlag || '',
                    // Backend-ээс ирж буй meregjilId-г шалгаж авах
                    meregjilId: (tetgelegData.meregjilId || []).map((m: any) => 
                        typeof m === 'object' ? m._id : m
                    ),
                    teteglegiin_Hemjee: String(tetgelegData.teteglegiin_Hemjee || ''),
                    bosgo_Onoo: String(tetgelegData.bosgo_Onoo || ''),
                    hugatsaa: tetgelegData.hugatsaa || '',
                    category: tetgelegData.category || 'Surguuli'
                });
            } catch (err) {
                console.error("Өгөгдөл татахад алдаа:", err);
                alert("Тэтгэлэгийн мэдээллийг татахад алдаа гарлаа.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id]);

    const toggleMergejil = (mId: string) => {
        setFormData(prev => ({
            ...prev,
            meregjilId: prev.meregjilId.includes(mId)
                ? prev.meregjilId.filter(id => id !== mId)
                : [...prev.meregjilId, mId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        if (formData.meregjilId.length === 0) {
            alert("Наад зах нь нэг мэргэжил сонгоно уу!");
            return;
        }

        setIsSaving(true);
        try {
            const submitData = {
                ...formData,
                bosgo_Onoo: Number(formData.bosgo_Onoo) || 0,
            };

            await updateTetgeleg(id, submitData as any);
            alert("Тэтгэлэг амжилттай шинэчлэгдлээ.");
            navigate('/tetgeleg');
        } catch (err) {
            console.error("Шинэчлэхэд алдаа:", err);
            alert("Хадгалахад алдаа гарлаа. Талбарын нэр meregjilId эсэхийг Backend дээр шалгана уу.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Буцах
                </Button>
                <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">Тэтгэлэг засварлах</h2>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-none px-4 py-1.5 rounded-full font-bold">
                    Засварлах горим
                </Badge>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Зүүн тал */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Тэтгэлэгийн нэр</label>
                            <Input 
                                required
                                className="h-12 rounded-xl bg-slate-50/50 border-none"
                                value={formData.teteglegNer}
                                onChange={e => setFormData({...formData, teteglegNer: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Тавигдах шаардлага</label>
                            <Textarea 
                                required
                                className="min-h-[180px] rounded-xl bg-slate-50/50 border-none resize-none"
                                value={formData.shaardlag}
                                onChange={e => setFormData({...formData, shaardlag: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Мэргэжил сонгох хэсэг */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" /> Холбоотой мэргэжлүүд
                            </label>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                {formData.meregjilId.length} сонгосон
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {mergejilList.map((m: any) => {
                                const isSelected = formData.meregjilId.includes(m._id);
                                return (
                                    <button
                                        type="button"
                                        key={m._id}
                                        onClick={() => toggleMergejil(m._id)}
                                        className={`p-3 rounded-xl border-2 text-[11px] font-bold transition-all
                                            ${isSelected 
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                                                : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                                    >
                                        {m.meregjil_Ner || m.mergejil_Ner}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Баруун тал */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Хэмжээ</label>
                            <Input 
                                className="h-11 rounded-xl"
                                value={formData.teteglegiin_Hemjee} 
                                onChange={e => setFormData({...formData, teteglegiin_Hemjee: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Босго оноо</label>
                            <Input 
                                type="number" step="0.1"
                                className="h-11 rounded-xl"
                                value={formData.bosgo_Onoo} 
                                onChange={e => setFormData({...formData, bosgo_Onoo: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Дуусах хугацаа</label>
                            <Input 
                                className="h-11 rounded-xl"
                                value={formData.hugatsaa} 
                                onChange={e => setFormData({...formData, hugatsaa: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Ангилал</label>
                            <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Surguuli">Сургуулийн тэтгэлэг</SelectItem>
                                    <SelectItem value="Turiin San">Төрийн сангийн тэтгэлэг</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button 
                            type="submit" 
                            disabled={isSaving} 
                            className="w-full h-14 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-50 transition-all"
                        >
                            {isSaving ? "Хадгалж байна..." : "Өөрчлөлтийг хадгалах"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => navigate('/tetgeleg')} 
                            className="w-full h-11 text-slate-400 font-bold hover:text-red-500 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" /> Цуцлах
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};