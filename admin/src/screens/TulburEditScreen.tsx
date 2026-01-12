import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, DollarSign, LayoutGrid, Loader2 } from 'lucide-react';
import { getTulbur, updateTulbur, getMergejil, type MergejilType, type TulburType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import MultiSelectMenu from '../components/common/multi_select_menu';

const TulburEditScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    
    const [mergejilList, setMergejilList] = useState<MergejilType[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState<TulburType>({
        terguuleh_erelttei: {
            meregjilId: [],
            tulbur: 0,
            negj_temdeg: '₮'
        },
        busad_mergejil: {
            meregjilId: [],
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
        const loadData = async () => {
            try {
                const [tList, mList] = await Promise.all([getTulbur(), getMergejil()]);
                setMergejilList(mList);
                
                const current = tList.find((t: TulburType) => t._id === id);
                if (current) {
                  
                    const formatIds = (ids: any[]) => ids.map(item => typeof item === 'object' ? item._id : item);
                    
                    setFormData({
                        ...current,
                        terguuleh_erelttei: {
                            ...current.terguuleh_erelttei,
                            meregjilId: formatIds(current.terguuleh_erelttei.meregjilId)
                        },
                        busad_mergejil: {
                            ...current.busad_mergejil,
                            meregjilId: formatIds(current.busad_mergejil.meregjilId)
                        }
                    });
                }
            } catch (err) {
                console.error("Data load error:", err);
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        try {
            const res = await updateTulbur(id, formData);
            dispatch({ type: 'UPDATE_TULBUR', payload: res });
            navigate('/tulbur');
        } catch (err) {
            alert("Засахад алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate('/tulbur')} className="group text-slate-500 hover:text-purple-600">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Буцах
            </Button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                            <DollarSign className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Төлбөрийн мэдээлэл засах</h1>
                            <p className="opacity-80 font-medium">Сонгосон төлбөрийн тариф болон мэргэжилүүдийг шинэчлэх</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                    
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Badge className="bg-green-500">1</Badge> Тэргүүлэх эрэлттэй мэргэжил
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-2">
                                <Label className="font-bold">Мэргэжилүүд</Label>
                             <MultiSelectMenu 
                            items={mergejilList.map(m => ({ label: m.mergejil_Ner, value: m._id! }))}
                       
                            selectedValues={formData.terguuleh_erelttei.meregjilId as string[]} 
                            onValueChange={(vals) => setFormData({
                                ...formData, 
                                terguuleh_erelttei: { ...formData.terguuleh_erelttei, meregjilId: vals }
                            })}
                        />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Төлбөр (Кредит)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        value={formData.terguuleh_erelttei.tulbur}
                                        className="h-12 pl-10 rounded-xl bg-white border-slate-200"
                                        onChange={e => setFormData({
                                            ...formData, 
                                            terguuleh_erelttei: { ...formData.terguuleh_erelttei, tulbur: Number(e.target.value) }
                                        })}
                                    />
                                    <span className="absolute left-4 top-3 text-slate-400 font-bold">₮</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Badge className="bg-blue-500">2</Badge> Бусад мэргэжил
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-2">
                                <Label className="font-bold">Мэргэжилүүд</Label>
                                <MultiSelectMenu 
                                items={mergejilList.map(m => ({ label: m.mergejil_Ner, value: m._id! }))}
                             
                                selectedValues={(formData.busad_mergejil.meregjilId as string[]) || []} 
                                onValueChange={(vals) => setFormData({
                                    ...formData, 
                                    busad_mergejil: { ...formData.busad_mergejil, meregjilId: vals }
                                })}
                            />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Төлбөр (Кредит)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        value={formData.busad_mergejil.tulbur}
                                        className="h-12 pl-10 rounded-xl bg-white border-slate-200"
                                        onChange={e => setFormData({
                                            ...formData, 
                                            busad_mergejil: { ...formData.busad_mergejil, tulbur: Number(e.target.value) }
                                        })}
                                    />
                                    <span className="absolute left-4 top-3 text-slate-400 font-bold">₮</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <LayoutGrid className="text-purple-600" /> Төлбөрийн задаргаа
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-purple-50/50 p-6 rounded-3xl border border-purple-100">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Заавал судлах</Label>
                                <Input 
                                    type="number" 
                                    value={formData.tulburiin_zadargaa.zaawlSudlah_kredit}
                                    className="h-12 rounded-xl bg-white border-purple-100"
                                    onChange={e => setFormData({
                                        ...formData, 
                                        tulburiin_zadargaa: { ...formData.tulburiin_zadargaa, zaawlSudlah_kredit: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Сонгон судлах</Label>
                                <Input 
                                    type="number" 
                                    value={formData.tulburiin_zadargaa.songonSudlah_kredit}
                                    className="h-12 rounded-xl bg-white border-purple-100"
                                    onChange={e => setFormData({
                                        ...formData, 
                                        tulburiin_zadargaa: { ...formData.tulburiin_zadargaa, songonSudlah_kredit: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Валют</Label>
                                <Input 
                                    value={formData.tulburiin_zadargaa.currency}
                                    className="h-12 rounded-xl bg-slate-100 border-none"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/tulbur')}
                            className="flex-1 h-14 rounded-2xl font-bold"
                        >
                            Болих
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-[2] h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 font-black text-lg shadow-lg text-white"
                        >
                            {loading ? "Хадгалж байна..." : "Өөрчлөлтийг хадгалах"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TulburEditScreen;