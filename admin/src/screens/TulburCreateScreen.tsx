import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, DollarSign, LayoutGrid, PlusCircle } from 'lucide-react';
import { createTulbur, getMergejil, type MergejilType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import MultiSelectMenu from '../components/common/multi_select_menu';

const TulburCreateScreen: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    const [mergejilList, setMergejilList] = useState<MergejilType[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        terguuleh_erelttei: {
            meregjilId: [] as string[],
            tulbur: 0,
            negj_temdeg: '₮'
        },
        busad_mergejil: {
            meregjilId: [] as string[],
            tulbur: 0,
            negj_temdeg: '₮'
        },
        tulburiin_zadargaa: {
            zaawlSudlah_kredit: 0,
            songonSudlah_kredit: 0,
            currency: 'MNT'
        }
    });

    useEffect(() => {
        const fetchMergejil = async () => {
            try {
                const res = await getMergejil();
                setMergejilList(res || []);
            } catch (err) {
                console.error("Мэргэжил татахад алдаа:", err);
            }
        };
        fetchMergejil();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createTulbur(formData);
            dispatch({ type: 'ADD_TULBUR', payload: res });
            navigate('/tulbur');
        } catch (err) {
            alert("Хадгалахад алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate('/tulbur')} className="text-slate-500 hover:text-purple-600 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" /> Буцах
            </Button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white">
                    <div className="flex items-center gap-4">
                        <PlusCircle className="w-8 h-8" />
                        <h1 className="text-3xl font-black">Шинэ төлбөр бүртгэх</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                    
                    {/* 1. Тэргүүлэх эрэлттэй мэргэжил */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 h-6 w-6 rounded-full flex items-center justify-center text-white p-0">1</Badge>
                            <h2 className="text-xl font-bold text-slate-800">Тэргүүлэх эрэлттэй мэргэжил</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Мэргэжилүүд сонгох</Label>
                                <MultiSelectMenu 
                                    items={mergejilList.map(m => ({ label: m.mergejil_Ner, value: m._id!.toString() }))}
                                    selectedValues={formData.terguuleh_erelttei.meregjilId}
                                    onValueChange={(vals) => setFormData(prev => ({
                                        ...prev,
                                        terguuleh_erelttei: { ...prev.terguuleh_erelttei, meregjilId: vals }
                                    }))}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Төлбөр (1 Кредит)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        className="h-12 pl-10 rounded-xl"
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            terguuleh_erelttei: { ...prev.terguuleh_erelttei, tulbur: Number(e.target.value) }
                                        }))}
                                    />
                                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Бусад мэргэжил */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center text-white p-0">2</Badge>
                            <h2 className="text-xl font-bold text-slate-800">Бусад мэргэжил</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Мэргэжилүүд сонгох</Label>
                                <MultiSelectMenu 
                                    items={mergejilList.map(m => ({ label: m.mergejil_Ner, value: m._id!.toString() }))}
                                    selectedValues={formData.busad_mergejil.meregjilId}
                                    onValueChange={(vals) => setFormData(prev => ({
                                        ...prev,
                                        busad_mergejil: { ...prev.busad_mergejil, meregjilId: vals }
                                    }))}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Төлбөр (1 Кредит)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        className="h-12 pl-10 rounded-xl"
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            busad_mergejil: { ...prev.busad_mergejil, tulbur: Number(e.target.value) }
                                        }))}
                                    />
                                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Кредитийн задаргаа */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="text-purple-600 w-6 h-6" />
                            <h2 className="text-xl font-bold text-slate-800">Төлбөрийн кредитийн задаргаа</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-purple-50/50 p-6 rounded-3xl border border-purple-100">
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Заавал судлах кредит (Дүн)</Label>
                                <Input 
                                    type="number" 
                                    className="h-12 rounded-xl bg-white border-purple-200"
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        tulburiin_zadargaa: { ...prev.tulburiin_zadargaa, zaawlSudlah_kredit: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">Сонгон судлах кредит (Дүн)</Label>
                                <Input 
                                    type="number" 
                                    className="h-12 rounded-xl bg-white border-purple-200"
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        tulburiin_zadargaa: { ...prev.tulburiin_zadargaa, songonSudlah_kredit: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button variant="outline" type="button" onClick={() => navigate('/tulbur')} className="flex-1 h-14 rounded-2xl font-bold">
                            Цуцлах
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-[2] h-14 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-2xl shadow-xl transition-all"
                        >
                            {loading ? "Хадгалж байна..." : "Төлбөр бүртгэх"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TulburCreateScreen;