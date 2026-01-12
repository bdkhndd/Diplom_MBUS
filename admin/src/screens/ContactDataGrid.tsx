import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Phone, Mail, MapPin, Plus, ShieldAlert, Facebook, Instagram, Globe, Loader2, Navigation2, Clock, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAPIActions } from '../context/APIActionContext';
import { getContactInfo, deleteContactInfo } from '../api/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from "../components/ui/card";
import { Badge } from '../components/ui/badge';

export const ContactDataGrid: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAPIActions();
    const { contactinfo: contacts, loading } = state;
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (contacts.length > 0) return;
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const res = await getContactInfo();
                dispatch({ type: 'SET_CONTACTINFO', payload: (res as any).data || res });
            } finally { dispatch({ type: 'SET_LOADING', payload: false }); }
        };
        fetchData();
    }, [dispatch, contacts.length]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Устгахдаа итгэлтэй байна уу?")) return;
        try {
            await deleteContactInfo(id);
            dispatch({ type: 'DELETE_CONTACTINFO', payload: id });
        } catch (error) {
            alert("Устгахад алдаа гарлаа.");
        }
    };

    const filtered = contacts.filter(c => c.address?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading && contacts.length === 0) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
            {/* Header*/}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm gap-4 border border-slate-100">
                <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Холбоо барих жагсаалт</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <Input 
                        placeholder="Хаягаар хайх..." 
                        className="rounded-2xl bg-slate-50 border-none shadow-inner h-12 w-full md:w-80" 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                    <Button onClick={() => navigate('/contact/create')} className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 font-bold h-12 shadow-lg shadow-blue-200 transition-all active:scale-95">
                        <Plus className="mr-2 h-5 w-5"/> ШИНЭ
                    </Button>
                </div>
            </div>

            {/* list */}
            <div className="grid grid-cols-1 gap-10">
                {filtered.map((contact) => (
                    <Card key={contact._id} className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white group transition-all">
                        <CardContent className="p-0">
                            
                         
                            <div className="p-10 bg-gradient-to-br from-white to-slate-50/50">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="space-y-4 flex-1">
                                        <Badge className={`${contact.isActive ? 'bg-green-500' : 'bg-red-500'} px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest`}>
                                            {contact.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                                        </Badge>
                                        
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-slate-900 leading-tight flex items-start gap-3">
                                                <MapPin className="w-8 h-8 text-blue-600 shrink-0 mt-1"/>
                                                {contact.address}
                                            </h3>
                                          
                                            <div className="flex items-center gap-2 ml-11">
                                                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100/50 shadow-sm">
                                                    <Navigation2 className="w-3.5 h-3.5 fill-blue-600"/>
                                                    <span className="text-xs font-mono font-bold">
                                                        {contact.location?.latitude}, {contact.location?.longitude}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Координат</span>
                                            </div>
                                        </div>
                                    </div>

                                  
                                    <div className="flex gap-3 bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100">
                                        {contact.facebook && (
                                            <a href={contact.facebook} target="_blank" rel="noreferrer" className="p-3 bg-[#1877F2]/10 rounded-2xl text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all">
                                                <Facebook className="w-6 h-6"/>
                                            </a>
                                        )}
                                        {contact.instagram && (
                                            <a href={contact.instagram} target="_blank" rel="noreferrer" className="p-3 bg-[#E4405F]/10 rounded-2xl text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all">
                                                <Instagram className="w-6 h-6"/>
                                            </a>
                                        )}
                                        {contact.website && (
                                            <a href={contact.website} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                                                <Globe className="w-6 h-6"/>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                          
                            <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 bg-white">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Холбоо барих суваг</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Mail className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Имэйл хаяг</p>
                                                <p className="font-bold text-slate-700">{contact.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600"><Phone className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Үндсэн утас</p>
                                                <p className="font-black text-slate-900">{contact.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Ажлын цагийн хуваарь</h4>
                                    <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100">
                                        <div className="flex justify-between items-center border-b border-blue-400/50 pb-3 mb-3">
                                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 opacity-70"/> <span className="text-sm font-medium">Ажлын өдрүүд</span></div>
                                            <span className="font-black text-lg">{contact.workingHours?.weekdays}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 opacity-70"/> <span className="text-sm font-medium">Амралтын өдөр</span></div>
                                            <span className="font-black text-lg text-blue-100">{contact.workingHours?.weekend}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                         
                            <div className="px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-600"><Building2 className="w-5 h-5"/><h4 className="text-xs font-black uppercase tracking-widest">Хэлтэсүүд</h4></div>
                                    <div className="space-y-2">
                                        {contact.departments?.map((dept, i) => (
                                            <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md hover:border-blue-100 border border-transparent transition-all">
                                                <span className="font-bold text-slate-700">{dept.name}</span>
                                                <span className="font-black text-blue-600">{dept.phone}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                         
                            <div className="px-10 py-6 bg-slate-50/80 flex justify-end gap-4 border-t border-slate-100">
                                <Button onClick={() => navigate(`/contact/edit/${contact._id}`)} className="h-12 px-8 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">ЗАСАХ</Button>
                                <Button onClick={() => handleDelete(contact._id!)} className="h-12 px-8 rounded-2xl bg-white border border-red-100 text-red-500 font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">УСТГАХ</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};