import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Plus, X, GraduationCap, BookOpen, Clock, Target } from 'lucide-react';
import { getMergejil, updateMergejil, getTenhim, type MergejilType, type TenhimType, type Hicheel } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import SelectMenu from '../components/common/mergejil_menu';

const MergejilEditScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();

    const [tenhimList, setTenhimList] = useState<TenhimType[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Form State
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
    const [newHicheel, setNewHicheel] = useState({ code: '', name: '', type: 'main' as const });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [ms, ts] = await Promise.all([getMergejil(), getTenhim()]);
                setTenhimList(ts);
                
                const current = ms.find((m: MergejilType) => m._id === id);
                if (current) {
                    const tId = typeof current.tenhimId === 'object' ? current.tenhimId?._id : current.tenhimId;
                    setFormData({
                        tenhimId: tId || '',
                        mergejil_Kod: current.mergejil_Kod || '',
                        mergejil_Ner: current.mergejil_Ner || '',
                        tailbar: current.tailbar || '',
                        sudlah_kredit: current.sudlah_kredit || 0,
                        suraltsah_hugatsaa: current.suraltsah_hugatsaa || '',
                        minScore: current.minScore || 0,
                    });
                    setHicheeluud(current.hicheeluud || []);
                }
            } catch (err) {
                console.error("Өгөгдөл татахад алдаа гарлаа:", err);
            } finally {
                setInitialLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    const handleAddHicheel = () => {
        if (newHicheel.code.trim() && newHicheel.name.trim()) {
            setHicheeluud([...hicheeluud, newHicheel]);
            setNewHicheel({ code: '', name: '', type: 'main' });
        }
    };

    const handleRemoveHicheel = (index: number) => {
        setHicheeluud(hicheeluud.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        try {
            const result = await updateMergejil(id, { ...formData, hicheeluud });
            dispatch({ type: 'UPDATE_MERGEJIL', payload: result });
            navigate('/mergejil');
        } catch (err) {
            alert('Засахад алдаа гарлаа');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-20 text-center font-bold text-indigo-600 animate-pulse text-xl">Ачаалж байна...</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/mergejil')} className="group text-slate-500 hover:text-indigo-600">
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Буцах
                </Button>
                <Badge variant="outline" className="px-4 py-1 text-blue-600 border-blue-200 bg-blue-50 font-mono">
                    ID: {id?.slice(-6).toUpperCase()}
                </Badge>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Мэргэжил засах</h1>
                            <p className="opacity-80 font-medium">Хөтөлбөрийн мэдээллийг шинэчлэх</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Үндсэн мэдээлэл */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Хамаарах Тэнхим
                            </Label>
                            <SelectMenu
                                items={tenhimList.map(t => ({ label: t.ner, value: t._id || '' }))}
                                defaultValue={formData.tenhimId}
                                onValueChange={(v) => setFormData({ ...formData, tenhimId: v })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Мэргэжлийн код
                            </Label>
                            <Input 
                                value={formData.mergejil_Kod} 
                                onChange={(e) => setFormData({ ...formData, mergejil_Kod: e.target.value })} 
                                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                                placeholder="Жишээ: SW01" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Мэргэжлийн нэр
                        </Label>
                        <Input 
                            value={formData.mergejil_Ner} 
                            onChange={(e) => setFormData({ ...formData, mergejil_Ner: e.target.value })} 
                            className="h-12 rounded-xl border-slate-200"
                            placeholder="Программ хангамж" 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><BookOpen size={16}/> Судлах кредит</Label>
                            <Input 
                                type="number" 
                                value={formData.sudlah_kredit} 
                                onChange={(e) => setFormData({ ...formData, sudlah_kredit: Number(e.target.value) })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><Clock size={16}/> Суралцах хугацаа</Label>
                            <Input 
                                value={formData.suraltsah_hugatsaa} 
                                onChange={(e) => setFormData({ ...formData, suraltsah_hugatsaa: e.target.value })}
                                className="h-12 rounded-xl"
                                placeholder="4 жил"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><Target size={16}/> Босго оноо</Label>
                            <Input 
                                type="number" 
                                value={formData.minScore} 
                                onChange={(e) => setFormData({ ...formData, minScore: Number(e.target.value) })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700">Мэргэжлийн тайлбар</Label>
                        <Textarea 
                            value={formData.tailbar} 
                            onChange={(e) => setFormData({ ...formData, tailbar: e.target.value })}
                            rows={4}
                            className="rounded-2xl border-slate-200 p-4"
                            placeholder="Энэхүү мэргэжлийн тухай дэлгэрэнгүй..."
                        />
                    </div>

                    {/* Хичээлүүдийн удирдлага */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Хичээлийн жагсаалт</h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">{hicheeluud.length} хичээл</Badge>
                        </div>

                        <div className="flex gap-3">
                            <Input 
                                placeholder="Код" 
                                value={newHicheel.code} 
                                onChange={(e) => setNewHicheel({...newHicheel, code: e.target.value})}
                                className="w-28 bg-white h-11 rounded-lg"
                            />
                            <Input 
                                placeholder="Хичээлийн нэр" 
                                value={newHicheel.name} 
                                onChange={(e) => setNewHicheel({...newHicheel, name: e.target.value})}
                                className="flex-1 bg-white h-11 rounded-lg"
                            />
                            <Button type="button" onClick={handleAddHicheel} className="bg-slate-800 hover:bg-black rounded-lg h-11 px-6">
                                <Plus size={18} className="mr-2" /> Нэмэх
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {hicheeluud.map((h, i) => (
                                <Badge key={i} className="pl-4 pr-1 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl gap-2 shadow-sm">
                                    <span className="font-mono text-blue-600 font-bold">{h.code}</span>
                                    <span className="font-medium">| {h.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveHicheel(i)}
                                        className="p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </Badge>
                            ))}
                            {hicheeluud.length === 0 && <p className="text-slate-400 text-sm italic py-2">Одоогоор хичээл нэмэгдээгүй байна.</p>}
                        </div>
                    </div>

                    {/* Үйлдлүүд */}
                    <div className="flex gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/mergejil')}
                            className="flex-1 h-14 rounded-2xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50"
                        >
                            Цуцлах
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95"
                        >
                            {loading ? "Хадгалж байна..." : (
                                <div className="flex items-center gap-2">
                                    <Save size={20} /> Өөрчлөлтийг хадгалах
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MergejilEditScreen;