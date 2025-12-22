import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, GraduationCap, 
    BookOpen, Save, X, DollarSign, Target, Calendar
} from 'lucide-react';

import { createTetgeleg, getMergejil } from '../api/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

export const TetgelegCreateScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [mergejilList, setMergejilList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        teteglegNer: '',
        shaardlag: '',
        meregjilId: [] as string[], // Таны хүссэн 'meregjilId' нэрээр
        teteglegiin_Hemjee: '',
        bosgo_Onoo: '',
        hugatsaa: '',
        category: 'Surguuli' 
    });

    useEffect(() => {
        const fetchMergejil = async () => {
            try {
                const res = await getMergejil();
                const data = (res as any).data || res;
                setMergejilList(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Мэргэжил татахад алдаа:", err);
            }
        };
        fetchMergejil();
    }, []);

    const toggleMergejil = (id: string) => {
        setFormData(prev => {
            const isSelected = prev.meregjilId.includes(id);
            return {
                ...prev,
                meregjilId: isSelected 
                    ? prev.meregjilId.filter(mId => mId !== id)
                    : [...prev.meregjilId, id]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.meregjilId.length === 0) {
            alert("Наад зах нь нэг мэргэжил сонгоно уу!");
            return;
        }

        setIsLoading(true);
        try {
            const submitData = {
                ...formData,
                bosgo_Onoo: Number(formData.bosgo_Onoo) || 0,
            };

            await createTetgeleg(submitData as any);
            alert("Тэтгэлэг амжилттай хадгалагдлаа.");
            navigate('/tetgeleg');
        } catch (err) {
            console.error("Хадгалах алдаа:", err);
            alert("Алдаа гарлаа. Backend-ийн 'meregjilId' талбарыг шалгана уу.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Буцах
                </Button>
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                    <h2 className="font-black text-slate-800 uppercase text-sm">Шинэ тэтгэлэг</h2>
                </div>
                <div className="w-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Тэтгэлэгийн нэр</label>
                            <Input 
                                required
                                placeholder="Нэрийг оруулна уу"
                                className="h-12 rounded-xl bg-slate-50/50"
                                value={formData.teteglegNer}
                                onChange={e => setFormData({...formData, teteglegNer: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Тавигдах шаардлага</label>
                            <Textarea 
                                required
                                placeholder="Шаардлагуудыг бичнэ үү..."
                                className="min-h-[150px] rounded-xl bg-slate-50/50 resize-none"
                                value={formData.shaardlag}
                                onChange={e => setFormData({...formData, shaardlag: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <label className="text-sm font-bold text-slate-700 mb-4 block flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-500" /> Мэргэжил сонгох
                        </label>
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
                                                ? 'border-purple-600 bg-purple-600 text-white' 
                                                : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                                    >
                                        {m.meregjil_Ner || m.mergejil_Ner}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Хэмжээ</label>
                            <Input 
                                placeholder="100% эсвэл дүн"
                                className="h-11 rounded-xl"
                                value={formData.teteglegiin_Hemjee} 
                                onChange={e => setFormData({...formData, teteglegiin_Hemjee: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Босго оноо</label>
                            <Input 
                                type="number"
                                placeholder="3.5"
                                className="h-11 rounded-xl"
                                value={formData.bosgo_Onoo} 
                                onChange={e => setFormData({...formData, bosgo_Onoo: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Дуусах хугацаа</label>
                            <Input 
                                placeholder="2025-06-01"
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
                        <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black">
                            {isLoading ? "Хадгалж байна..." : "Тэтгэлэг нэмэх"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/tetgeleg')} className="w-full h-11 text-slate-400 font-bold hover:text-red-500">
                            Цуцлах
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};