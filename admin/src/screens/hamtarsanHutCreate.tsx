import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHamtarsanHut, getMergejil, type MergejilType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const HamtarsanHutCreate: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAPIActions();

    const [mergejils, setMergejils] = useState<MergejilType[]>([]);
    
    const [formData, setFormData] = useState({
        mergejilId: '',
        uls: '',
        surguuli: '',
        hutulbur: '',
        hugatsaa: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchMergejils = async () => {
            try {
                const res: any = await getMergejil();
                const data = res.data || res;
                setMergejils(data);
            } catch (err) {
                console.error("Мэргэжил татаж чадсангүй:", err);
            }
        };
        fetchMergejils();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mergejilId) {
            alert("Мэргэжил сонгоно уу!");
            return;
        }

        setIsSubmitting(true);
        try {
          
            const result = await createHamtarsanHut(formData);
            
            const newData = result; 
            
            dispatch({ type: 'ADD_HAMTARSAN_HUT', payload: newData });
            
            alert("Хамтарсан хөтөлбөр амжилттай нэмэгдлээ.");
            navigate('/hamtarsan_hut');
        } catch (error) {
            console.error("Нэмэхэд алдаа гарлаа:", error);
            alert("Алдаа гарлаа. Та мэдээллээ шалгана уу.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-xl mt-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">➕ Шинэ хамтарсан хөтөлбөр нэмэх</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
             
                <div className="space-y-2">
                    <Label htmlFor="mergejilId">Хамаарах мэргэжил</Label>
                    <select
                        id="mergejilId"
                        name="mergejilId"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        value={formData.mergejilId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Мэргэжил сонгоно уу --</option>
                        {mergejils.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.mergejil_Ner}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Улс</Label>
                        <Input name="uls" value={formData.uls} onChange={handleChange} placeholder="Жишээ: Австрали" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Хамтрагч сургууль</Label>
                        <Input name="surguuli" value={formData.surguuli} onChange={handleChange} placeholder="Сургуулийн нэр" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Хөтөлбөрийн нэр</Label>
                    <Input name="hutulbur" value={formData.hutulbur} onChange={handleChange} placeholder="Жишээ: 2+2 хөтөлбөр" required />
                </div>

                <div className="space-y-2">
                    <Label>Хугацаа</Label>
                    <Input name="hugatsaa" value={formData.hugatsaa} onChange={handleChange} placeholder="Жишээ: 2024-2026 он" required />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button 
                        type="submit" 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/hamtarsan_hut')}
                    >
                        Цуцлах
                    </Button>
                </div>
            </form>
        </div>
    );
};