import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Plus, X, GraduationCap, BookOpen, Clock, Target, ListChecks, Info } from 'lucide-react';
import { createMergejil, getTenhim, type TenhimType, type Hicheel } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import SelectMenu from '../components/common/mergejil_menu';

const MergejilCreateScreen: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    const [tenhimList, setTenhimList] = useState<TenhimType[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        tenhimId: '',
        mergejil_Kod: '',
        mergejil_Ner: '',
        tailbar: '',
        sudlah_kredit: 0,
        suraltsah_hugatsaa: '',
        minScore: 0,
    });

    const [hicheeluud, setHicheeluud] = useState<Hicheel[]>([]);
    const [newHicheel, setNewHicheel] = useState<{code: string, name: string, type: 'main' | 'secondary'}>({ 
        code: '', name: '', type: 'main' 
    });

    useEffect(() => {
        getTenhim().then(setTenhimList).catch(console.error);
    }, []);

    const handleAddHicheel = () => {
        if (newHicheel.code.trim() && newHicheel.name.trim()) {
            setHicheeluud([...hicheeluud, newHicheel]);
            setNewHicheel({ code: '', name: '', type: 'main' });
        }
    };

    const removeHicheel = (index: number) => {
        setHicheeluud(hicheeluud.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tenhimId) return alert("Тэнхим сонгоно уу");
        setLoading(true);
        try {
            const res = await createMergejil({ ...formData, hicheeluud });
            dispatch({ type: 'ADD_MERGEJIL', payload: res });
            navigate('/mergejil');
        } catch (err) {
            alert("Алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate('/mergejil')} className="group text-slate-500 hover:text-indigo-600">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Буцах
            </Button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-white">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                            <GraduationCap className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Шинэ мэргэжил үүсгэх</h1>
                            <p className="opacity-80 font-medium">Системд шинэ сургалтын хөтөлбөр бүртгэх</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ListChecks className="text-indigo-600" /> Ерөнхий мэдээлэл
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Хамаарах Тэнхим</Label>
                                <SelectMenu 
                                    items={tenhimList.map(t => ({ label: t.ner, value: t._id! }))}
                                    onValueChange={(v) => setFormData({...formData, tenhimId: v})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Мэргэжлийн код</Label>
                                <Input placeholder="SW01" className="h-12 rounded-xl" onChange={e => setFormData({...formData, mergejil_Kod: e.target.value})} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Мэргэжлийн бүтэн нэр</Label>
                            <Input placeholder="Программ хангамж" className="h-12 rounded-xl" onChange={e => setFormData({...formData, mergejil_Ner: e.target.value})} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 font-bold"><BookOpen size={16}/> Кредит</Label>
                                <Input type="number" className="h-12 rounded-xl" onChange={e => setFormData({...formData, sudlah_kredit: Number(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 font-bold"><Clock size={16}/> Хугацаа</Label>
                                <Input placeholder="4 жил" className="h-12 rounded-xl" onChange={e => setFormData({...formData, suraltsah_hugatsaa: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 font-bold"><Target size={16}/> Босго оноо</Label>
                                <Input type="number" className="h-12 rounded-xl" onChange={e => setFormData({...formData, minScore: Number(e.target.value)})} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800">Судлах хичээлүүд</h2>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                <Input placeholder="Код" value={newHicheel.code} onChange={e => setNewHicheel({...newHicheel, code: e.target.value})} className="md:w-28 bg-white h-11" />
                                <Input placeholder="Нэр" value={newHicheel.name} onChange={e => setNewHicheel({...newHicheel, name: e.target.value})} className="flex-1 bg-white h-11" />
                                <Select value={newHicheel.type} onValueChange={(v: 'main' | 'secondary') => setNewHicheel({...newHicheel, type: v})}>
                                    <SelectTrigger className="w-full md:w-40 bg-white h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="main">Үндсэн</SelectItem>
                                        <SelectItem value="secondary">Дагалдах</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="button" onClick={handleAddHicheel} className="bg-slate-800 hover:bg-black rounded-xl h-11"><Plus size={18}/></Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {hicheeluud.map((h, i) => (
                                    <Badge key={i} className={`pl-4 pr-1 py-2 rounded-xl flex items-center gap-2 border shadow-sm ${h.type === 'main' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                        <span className="font-bold text-[11px] uppercase">{h.code}</span>
                                        <span className="font-medium text-[11px]">{h.name}</span>
                                        <button onClick={() => removeHicheel(i)} className="p-1 hover:text-red-500"><X size={14}/></button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700 flex items-center gap-2"><Info size={16}/> Мэргэжлийн тайлбар</Label>
                        <Textarea className="min-h-[120px] rounded-2xl p-4" onChange={e => setFormData({...formData, tailbar: e.target.value})} />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate('/mergejil')} className="flex-1 h-14 rounded-2xl">Цуцлах</Button>
                        <Button type="submit" disabled={loading} className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg">
                            {loading ? "Хадгалж байна..." : "Мэргэжил үүсгэх"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MergejilCreateScreen;