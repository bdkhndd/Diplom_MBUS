import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHamtarsanHutById, updateHamtarsanHut, getMergejil } from '../api'; 
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoaderOne } from '../components/ui/loader';

export const HamtarsanHutEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, dispatch } = useAPIActions();

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        mergejilId: '',
        uls: '',
        surguuli: '',
        hutulbur: '',
        hugatsaa: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
               
                if (state.mergejil.length === 0) {
                    const mRes: any = await getMergejil();
                    const payloadData = mRes.data || mRes;
                    dispatch({ type: 'SET_MERGEJIL', payload: payloadData });
                }

                const result = await getHamtarsanHutById(id);
               
                const actualData: any = result; 
                
                setFormData({
                   
                    mergejilId: typeof actualData.mergejilId === 'object' ? 
                                (actualData.mergejilId._id || actualData.mergejilId) : 
                                actualData.mergejilId,
                    uls: actualData.uls || '',
                    surguuli: actualData.surguuli || '',
                    hutulbur: actualData.hutulbur || '',
                    hugatsaa: actualData.hugatsaa || ''
                });
            } catch (err) {
                console.error("Датаг авахад алдаа гарлаа:", err);
                alert("Датаг ачаалахад алдаа гарлаа.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [id, dispatch, state.mergejil.length]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await updateHamtarsanHut(id!, formData);
            
            dispatch({ 
                type: 'UPDATE_HAMTARSAN_HUT', 
                payload: result 
            });
            
            alert("Амжилттай шинэчлэгдлээ.");
            navigate('/hamtarsan_hut'); 
        } catch (error) {
            console.error("Засахад алдаа гарлаа:", error);
            alert("Шинэчлэхэд алдаа гарлаа.");
        }
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading) return <LoaderOne />;

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">🤝 Хамтарсан хөтөлбөр засах</h1>
            
            <form onSubmit={handleUpdate} className="space-y-5">
        
                <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Хамаарах мэргэжил</label>
                    <select
                        name="mergejilId"
                        value={formData.mergejilId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                    >
                        <option value="">Мэргэжил сонгоно уу</option>
                        {state.mergejil.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.mergejil_Ner}
                            </option>
                        ))}
                    </select>
                </div>

            
                <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Сургуулийн нэр</label>
                    <Input 
                        name="surguuli" 
                        value={formData.surguuli} 
                        onChange={handleChange} 
                        placeholder="Жишээ: Акита Их Сургууль"
                        required
                    />
                </div>

            
                <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Улс</label>
                    <Input 
                        name="uls" 
                        value={formData.uls} 
                        onChange={handleChange} 
                        placeholder="Жишээ: Япон"
                        required
                    />
                </div>

              
                <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Хөтөлбөр</label>
                    <Input 
                        name="hutulbur" 
                        value={formData.hutulbur} 
                        onChange={handleChange} 
                        placeholder="Жишээ: 2+2 хөтөлбөр"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Хугацаа</label>
                    <Input 
                        name="hugatsaa" 
                        value={formData.hugatsaa} 
                        onChange={handleChange} 
                        placeholder="Жишээ: 4 жил"
                        required
                    />
                </div>
                
                <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                        Хадгалах
                    </Button>
                    <Button 
                        variant="outline" 
                        type="button" 
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