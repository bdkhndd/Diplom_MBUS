// admin/src/components/TetgelegForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

// API болон Types-ийг импорт хийнэ
import {
    type TetgelegType,
    type MergejilType,
    type ApiResponse,
    createTetgeleg,
    getTetgelegById,
    updateTetgeleg,
    getMergejil,
} from '../api/index';

import { useAPIActions } from '../context/APIActionContext'; 

// UI Component-ууд
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import SelectMenu from './common/SelectMenu'; 
import { Textarea } from './ui/textarea';

// Form-д хэрэглэх өгөгдлийн төрөл
type TetgelegFormValues = Omit<TetgelegType, '_id' | 'createdAt' | 'updatedAt'>;

export function TetgelegForm() {
    const { dispatch } = useAPIActions();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    
    const [pageTitle, setPageTitle] = useState("Шинэ Тэтгэлэг Нэмэх");
    const [mergejilList, setMergejilList] = useState<MergejilType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TetgelegFormValues>();

    // 1. API CALLS: Мэргэжлийн мэдээллийг татаж авах
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const mergejilRes: ApiResponse<MergejilType[]> = await getMergejil();
                setMergejilList(mergejilRes.data);

                if (isEditMode && id) {
                    setPageTitle("Тэтгэлэгийн Мэдээлэл Засах");
                    const res: ApiResponse<TetgelegType> = await getTetgelegById(id);
                    const tetgeleg = res.data;
                    
                    // Формыг өгөгдлөөр дүүргэх
                    reset({
                        mergejilId: tetgeleg.mergejilId,
                        tetgelegNer: tetgeleg.tetgelegNer,
                        shaardlag: tetgeleg.shaardlag,
                        bosgo_Onoo: tetgeleg.bosgo_Onoo,
                        teteglegiin_Hemjee: tetgeleg.teteglegiin_Hemjee,
                        hugatsaa: tetgeleg.hugatsaa,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dependencies or Tetgeleg data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDependencies();
    }, [id, isEditMode, reset]);

    // 2. FORM SUBMIT
    const onSubmit: SubmitHandler<TetgelegFormValues> = async (data) => {
        try {
            if (id) {
                // UPDATE
                const res: ApiResponse<TetgelegType> = await updateTetgeleg(id, data);
                dispatch({ type: 'UPDATE_TETGELEG', payload: res.data }); 
            } else {
                // CREATE
                const res: ApiResponse<TetgelegType> = await createTetgeleg(data);
                dispatch({ type: 'ADD_TETGELEG', payload: res.data });
            }
            
            navigate('/tetgeleg'); 
        } catch (error) {
            console.error("Failed to save Tetgeleg:", error);
            alert("Мэдээлэл хадгалахад алдаа гарлаа.");
        }
    };

    if (isLoading) {
        return <div className="p-5 text-center text-gray-500">Мэргэжлийн мэдээлэл ачаалж байна...</div>;
    }

    // Select Menu-д зориулсан options
    const mergejilOptions = mergejilList.map(m => ({ 
        label: `${m.mergejil_Ner} (${m.mergejil_Kod})`, 
        value: m._id || '' 
    }));


    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">{pageTitle}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1. Mergejil ID */}
                <div>
                    <Label htmlFor="mergejilId">Хамаарах Мэргэжил *</Label>
                    <Controller
                        name="mergejilId"
                        control={control}
                        rules={{ required: "Мэргэжил заавал сонгоно." }}
                        render={({ field }) => (
                            <SelectMenu 
                                items={mergejilOptions}
                                placeholder="Мэргэжил сонгоно уу..."
                                onValueChange={(value) => field.onChange(value)}
                                defaultValue={field.value}
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    {errors.mergejilId && <p className="text-red-500 text-sm mt-1">{errors.mergejilId.message}</p>}
                </div>
                
                {/* 2. Тэтгэлэгийн Нэр */}
                <div>
                    <Label htmlFor="tetgelegNer">Тэтгэлэгийн Нэр *</Label>
                    <Input
                        id="tetgelegNer"
                        {...register("tetgelegNer", { required: "Тэтгэлэгийн нэр заавал шаардлагатай." })}
                        placeholder="Судалгааны тэтгэлэг"
                        disabled={isSubmitting}
                    />
                    {errors.tetgelegNer && <p className="text-red-500 text-sm mt-1">{errors.tetgelegNer.message}</p>}
                </div>
                
                {/* 3. Шаардлага */}
                <div>
                    <Label htmlFor="shaardlag">Үндсэн Шаардлага (Тайлбар) *</Label>
                    <Textarea
                        id="shaardlag"
                        {...register("shaardlag", { required: "Шаардлага заавал." })}
                        placeholder="Голч 3.2-оос дээш, нийгмийн идэвхтэй байх."
                        disabled={isSubmitting}
                        rows={3}
                    />
                    {errors.shaardlag && <p className="text-red-500 text-sm mt-1">{errors.shaardlag.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* 4. Босго Оноо */}
                    <div>
                        <Label htmlFor="bosgo_Onoo">Босго Голч Оноо (GPA) *</Label>
                        <Input
                            id="bosgo_Onoo"
                            type="number"
                            step="0.01" // 0.01-ээр өсөх/буурах
                            {...register("bosgo_Onoo", { 
                                required: "Босго оноо заавал.", 
                                valueAsNumber: true,
                                min: { value: 1.0, message: "1.0-ээс дээш байх ёстой." }
                            })}
                            placeholder="3.0"
                            disabled={isSubmitting}
                        />
                        {errors.bosgo_Onoo && <p className="text-red-500 text-sm mt-1">{errors.bosgo_Onoo.message}</p>}
                    </div>

                    {/* 5. Тэтгэлэгийн Хэмжээ (%) */}
                    <div>
                        <Label htmlFor="teteglegiin_Hemjee">Тэтгэлэгийн Хэмжээ (%) *</Label>
                        <Input
                            id="teteglegiin_Hemjee"
                            type="number"
                            {...register("teteglegiin_Hemjee", { 
                                required: "Хэмжээ заавал.", 
                                valueAsNumber: true,
                                min: { value: 10, message: "10-аас дээш байх ёстой." },
                                max: { value: 100, message: "100-аас хэтрэхгүй байх ёстой." }
                            })}
                            placeholder="50"
                            disabled={isSubmitting}
                        />
                        {errors.teteglegiin_Hemjee && <p className="text-red-500 text-sm mt-1">{errors.teteglegiin_Hemjee.message}</p>}
                    </div>
                    
                    {/* 6. Хугацаа */}
                    <div>
                        <Label htmlFor="hugatsaa">Үргэлжлэх хугацаа *</Label>
                        <Input
                            id="hugatsaa"
                            {...register("hugatsaa", { required: "Хугацаа заавал." })}
                            placeholder="1 улирал"
                            disabled={isSubmitting}
                        />
                        {errors.hugatsaa && <p className="text-red-500 text-sm mt-1">{errors.hugatsaa.message}</p>}
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? 'Хадгалж байна...' : `✅ ${id ? 'Өөрчлөлт Хадгалах' : 'Тэтгэлэг Нэмэх'}`}
                </Button>
            </form>
        </div>
    );
}