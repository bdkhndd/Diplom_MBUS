import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import {
    type HamtarsanHutType,
    type MergejilType,
    type ApiResponse,
    createHamtarsanHut,
    getHamtarsanHutById,
    updateHamtarsanHut,
    getMergejil,
} from '../api/index';

import { useAPIActions } from '../context/APIActionContext'; 
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import SelectMenu from './common/SelectMenu'; 

type HamtarsanHutFormValues = Omit<HamtarsanHutType, '_id' | 'createdAt' | 'updatedAt'>;

export function HamtarsanHutForm() {
    const { dispatch } = useAPIActions();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    
    const [pageTitle, setPageTitle] = useState("Шинэ Хамтарсан Хөтөлбөр Нэмэх");
    const [mergejilList, setMergejilList] = useState<MergejilType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue, 
        reset,
        formState: { errors, isSubmitting },
    } = useForm<HamtarsanHutFormValues>({
        defaultValues: {
            mergejilId: '', 
            uls: '',
            surguuli: '',
            hutulbur: '',
            hugatsaa: '',
        }
    });
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const mergejilRes: ApiResponse<MergejilType[]> = await getMergejil();
                setMergejilList(mergejilRes.data);
            } catch (err) {
                console.error("Failed to fetch mergejil data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDependencies();
    }, []);
    useEffect(() => {
        if (id) {
            setPageTitle("Хамтарсан Хөтөлбөр Засах");
            const fetchData = async () => {
                try {
                    const res: ApiResponse<HamtarsanHutType> = await getHamtarsanHutById(id);
                    const hut = res.data;
                    
                    reset({
                        mergejilId: hut.mergejilId,
                        uls: hut.uls,
                        surguuli: hut.surguuli,
                        hutulbur: hut.hutulbur,
                        hugatsaa: hut.hugatsaa,
                    });

                } catch (error) {
                    console.error("Failed to fetch Hamtarsan Hut for editing:", error);
                    alert("Мэдээлэл татахад алдаа гарлаа.");
                    navigate('/hamtarsan-hut'); 
                }
            };
            fetchData();
        }
    }, [id, navigate, reset]);

    const onSubmit: SubmitHandler<HamtarsanHutFormValues> = async (data) => {
        try {
            if (id) {
                const res: ApiResponse<HamtarsanHutType> = await updateHamtarsanHut(id, data);
                dispatch({ type: 'UPDATE_HAMTARSAN_HUT', payload: res.data }); 
            } else {
                const res: ApiResponse<HamtarsanHutType> = await createHamtarsanHut(data);
                dispatch({ type: 'ADD_HAMTARSAN_HUT', payload: res.data });
            }
            
            navigate('/hamtarsan-hut'); 
        } catch (error) {
            console.error("Failed to save Hamtarsan Hut:", error);
            alert("Мэдээлэл хадгалахад алдаа гарлаа.");
        }
    };

    if (isLoading) {
        return <div className="p-5 text-center text-gray-500">Мэргэжлийн мэдээлэл ачаалж байна...</div>;
    }
    const mergejilOptions = mergejilList.map(m => ({
        label: `${m.mergejil_Ner} (${m.mergejil_Kod})`,
        value: m._id || '', 
    }));


    return (
        <div className="w-full max-w-xl mx-auto p-5 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{pageTitle}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div>
                    <Label htmlFor="mergejilId" className="text-sm font-medium">Хамаарах Мэргэжил Сонгох *</Label>
                    <SelectMenu 
                        items={mergejilOptions}
                        placeholder="Мэргэжил сонгоно уу..."
                        onValueChange={(value) => setValue('mergejilId', value, { shouldValidate: true })}
                        className="mt-1"
                        disabled={isSubmitting}
                    />
                    <input type="hidden" {...register("mergejilId", { required: "Мэргэжил заавал сонгоно." })} />
                    {errors.mergejilId && <p className="text-red-500 text-sm mt-1">{errors.mergejilId.message}</p>}
                </div>

                <div>
                    <Label htmlFor="uls">Улс *</Label>
                    <Input
                        id="uls"
                        {...register("uls", { required: "Улсын нэр заавал шаардлагатай." })}
                        placeholder="Солонгос"
                        disabled={isSubmitting}
                    />
                    {errors.uls && <p className="text-red-500 text-sm mt-1">{errors.uls.message}</p>}
                </div>
                
                <div>
                    <Label htmlFor="surguuli">Хамтарсан Сургууль *</Label>
                    <Input
                        id="surguuli"
                        {...register("surguuli", { required: "Сургуулийн нэр заавал шаардлагатай." })}
                        placeholder="Seoul National University"
                        disabled={isSubmitting}
                    />
                    {errors.surguuli && <p className="text-red-500 text-sm mt-1">{errors.surguuli.message}</p>}
                </div>

                <div>
                    <Label htmlFor="hutulbur">Хөтөлбөрийн Нэр *</Label>
                    <Input
                        id="hutulbur"
                        {...register("hutulbur", { required: "Хөтөлбөрийн нэр заавал шаардлагатай." })}
                        placeholder="Double Degree Program"
                        disabled={isSubmitting}
                    />
                    {errors.hutulbur && <p className="text-red-500 text-sm mt-1">{errors.hutulbur.message}</p>}
                </div>

                <div>
                    <Label htmlFor="hugatsaa">Хугацаа (жишээ нь: 2+2, 1 семестр) *</Label>
                    <Input
                        id="hugatsaa"
                        {...register("hugatsaa", { required: "Хугацаа заавал шаардлагатай." })}
                        placeholder="2 жил"
                        disabled={isSubmitting}
                    />
                    {errors.hugatsaa && <p className="text-red-500 text-sm mt-1">{errors.hugatsaa.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">
                    {isSubmitting ? 'Хадгалж байна...' : `✅ ${id ? 'Өөрчлөлт Хадгалах' : 'Хөтөлбөр Нэмэх'}`}
                </Button>
            </form>
        </div>
    );
}