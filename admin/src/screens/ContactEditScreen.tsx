import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, MapPin, Navigation2, Clock, ShieldAlert, Building2, Facebook, Instagram, Globe, Loader2 } from 'lucide-react';
import { useAPIActions } from '../context/APIActionContext';
import { getContactInfoById, updateContactInfo } from '../api/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from '../components/ui/switch';

export const ContactEditScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        address: '', phone: '', email: '', website: '', facebook: '', instagram: '', isActive: true,
        workingHours: { weekdays: '', weekend: '' },
        departments: [{ name: '', phone: '' }],
        emergencyContacts: [{ name: '', phone: '' }],
        location: { latitude: 0, longitude: 0 }
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getContactInfoById(id!);
                const d = (res as any).data || res;
                setFormData({
                    ...d,
                    departments: d.departments?.length ? d.departments : [{name:'', phone:''}],
                    emergencyContacts: d.emergencyContacts?.length ? d.emergencyContacts : [{name:'', phone:''}],
                    location: d.location || {latitude: 47.91, longitude: 106.91}
                });
            } finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await updateContactInfo(id!, formData as any);
            dispatch({ type: 'UPDATE_CONTACTINFO', payload: (res as any).data || res });
            alert("Амжилттай шинэчлэгдлээ!");
            navigate('/contact');
        } finally { setSubmitting(false); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600"/></div>;

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-8 bg-slate-50/30 min-h-screen">
            <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl font-bold"><ArrowLeft className="mr-2 h-4 w-4"/> БУЦАХ</Button>
                <h1 className="text-xl font-black uppercase text-slate-800">Мэдээлэл засах</h1>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl">
                        <CardHeader><CardTitle className="text-lg font-black flex items-center gap-2"><MapPin className="text-blue-600"/> Байршлын мэдээлэл</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Хаяг" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-2xl bg-slate-50 border-none font-bold"/>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Утас" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-2xl bg-slate-50 border-none"/>
                                <Input placeholder="Имэйл" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-2xl bg-slate-50 border-none"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-lg font-black flex items-center gap-2"><Building2 className="text-blue-600"/> Хэлтэсүүд</CardTitle>
                            <Button type="button" size="sm" onClick={() => setFormData({...formData, departments: [...formData.departments, {name:'', phone:''}]})} className="rounded-full bg-blue-600"><Plus className="w-4 h-4"/></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.departments.map((dept, idx) => (
                                <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-2xl items-center border border-slate-100 shadow-sm">
                                    <Input placeholder="Нэр" value={dept.name} onChange={e => {
                                        const newDepts = [...formData.departments]; newDepts[idx].name = e.target.value; setFormData({...formData, departments: newDepts});
                                    }} className="bg-white rounded-xl h-11 border-none"/>
                                    <Input placeholder="Утас" value={dept.phone} onChange={e => {
                                        const newDepts = [...formData.departments]; newDepts[idx].phone = e.target.value; setFormData({...formData, departments: newDepts});
                                    }} className="bg-white rounded-xl h-11 border-none font-bold"/>
                                    <Button type="button" variant="ghost" onClick={() => setFormData({...formData, departments: formData.departments.filter((_, i) => i !== idx)})} className="text-red-400"><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl">
                        <CardHeader><CardTitle className="text-lg font-black flex items-center gap-2"><Navigation2 className="text-blue-600"/> GPS Координат</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-400">
                            <div className="space-y-2"><span>LATITUDE</span><Input type="number" step="any" value={formData.location.latitude} onChange={e => setFormData({...formData, location: {...formData.location, latitude: parseFloat(e.target.value)}})} className="h-11 rounded-xl bg-slate-50 border-none font-mono text-slate-800"/></div>
                            <div className="space-y-2"><span>LONGITUDE</span><Input type="number" step="any" value={formData.location.longitude} onChange={e => setFormData({...formData, location: {...formData.location, longitude: parseFloat(e.target.value)}})} className="h-11 rounded-xl bg-slate-50 border-none font-mono text-slate-800"/></div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl">
                        <CardHeader><CardTitle className="text-lg font-black flex items-center gap-2"><Clock className="text-blue-600"/> Төлөв & Цаг</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <span className="font-bold text-slate-700">Идэвхтэй төлөв</span>
                                <Switch checked={formData.isActive} onCheckedChange={(val) => setFormData({...formData, isActive: val})} />
                            </div>
                            <Input placeholder="Ажлын өдөр" value={formData.workingHours.weekdays} onChange={e => setFormData({...formData, workingHours: {...formData.workingHours, weekdays: e.target.value}})} className="rounded-xl bg-slate-50 border-none h-11"/>
                            <Input placeholder="Амралт" value={formData.workingHours.weekend} onChange={e => setFormData({...formData, workingHours: {...formData.workingHours, weekend: e.target.value}})} className="rounded-xl bg-red-50/30 border-none h-11 text-red-600 font-bold"/>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl">
                        <CardHeader><CardTitle className="text-lg font-black">Сошиал сувгууд</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl"><Facebook className="text-blue-600 w-4 h-4 ml-1"/><Input placeholder="Facebook URL" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="border-none bg-transparent h-8 text-[10px] focus-visible:ring-0"/></div>
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl"><Instagram className="text-pink-600 w-4 h-4 ml-1"/><Input placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="border-none bg-transparent h-8 text-[10px] focus-visible:ring-0"/></div>
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl"><Globe className="text-slate-400 w-4 h-4 ml-1"/><Input placeholder="Website URL" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="border-none bg-transparent h-8 text-[10px] focus-visible:ring-0"/></div>
                        </CardContent>
                    </Card>

                    <Button disabled={submitting} className="w-full h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95">
                        {submitting ? "ШИНЭЧИЛЖ БАЙНА..." : "ӨӨРЧЛӨЛТИЙГ ХАДГАЛАХ"}
                    </Button>
                </div>
            </form>
        </div>
    );
};