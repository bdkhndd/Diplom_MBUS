// admin/src/components/TenhimForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

// API болон Types-ийг импорт хийнэ
import {
    type TenhimType,
    type ApiResponse,
    createTenhim,
    getTenhimById,
    updateTenhim,
} from '../api/index';

import { useAPIActions } from '../context/APIActionContext'; 

// UI Component-ууд
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import { Textarea } from './ui/textarea';

// Form-д хэрэглэх өгөгдлийн төрөл
type TenhimFormValues = Omit<TenhimType, '_id' | 'createdAt' | 'updatedAt' | 'zurag'>; // Zurag-ийг түр алгасав

export function TenhimForm() {
    const { dispatch } = useAPIActions();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    
    const [pageTitle, setPageTitle] = useState("Шинэ Тэнхим Нэмэх");
    const [isLoading, setIsLoading] = useState(true);
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TenhimFormValues>();

    // 1. EDIT MODE: Засах горимд өгөгдөл татаж авах
    useEffect(() => {
        const fetchData = async () => {
            if (isEditMode && id) {
                setPageTitle("Тэнхим Засах");
                try {
                    const res: ApiResponse<TenhimType> = await getTenhimById(id);
                    const tenhim = res.data;
                    
                    // Формыг өгөгдлөөр дүүргэх
                    reset({
                        ner: tenhim.ner,
                        tergvvleh_chiglel: tenhim.tergvvleh_chiglel,
                        shagnal: tenhim.shagnal,
                        bvteel: tenhim.bvteel,
                        tailbar: tenhim.tailbar,
                        // zurag-ийг одоогоор form-д оруулсангүй
                    });
                } catch (error) {
                    console.error("Failed to fetch Tenhim data:", error);
                    alert("Мэдээлэл татахад алдаа гарлаа.");
                    navigate('/tenhim'); 
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, isEditMode, navigate, reset]);

    // 2. FORM SUBMIT
    const onSubmit: SubmitHandler<TenhimFormValues> = async (data) => {
        try {
            if (id) {
                // UPDATE
                const res: ApiResponse<TenhimType> = await updateTenhim(id, data);
                dispatch({ type: 'UPDATE_TENHIM', payload: res.data }); 
            } else {
                // CREATE
                const res: ApiResponse<TenhimType> = await createTenhim(data);
                dispatch({ type: 'ADD_TENHIM', payload: res.data });
            }
            
            navigate('/tenhim'); 
        } catch (error) {
            console.error("Failed to save Tenhim:", error);
            alert("Мэдээлэл хадгалахад алдаа гарлаа.");
        }
    };

    if (isLoading) {
        return <div className="p-5 text-center text-gray-500">Мэдээлэл ачаалж байна...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">{pageTitle}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1. Тэнхимийн Нэр */}
                <div>
                    <Label htmlFor="ner">Тэнхимийн Нэр *</Label>
                    <Input
                        id="ner"
                        {...register("ner", { required: "Тэнхимийн нэр заавал шаардлагатай." })}
                        placeholder="Програм хангамжийн тэнхим"
                        disabled={isSubmitting}
                    />
                    {errors.ner && <p className="text-red-500 text-sm mt-1">{errors.ner.message}</p>}
                </div>
                
                {/* 2. Тэргүүлэх Чиглэл */}
                <div>
                    <Label htmlFor="tergvvlveh_chiglel">Тэргүүлэх Чиглэл *</Label>
                    <Input
                        id="tergvvlveh_chiglel"
                        {...register("tergvvleh_chiglel", { required: "Тэргүүлэх чиглэл заавал." })}
                        placeholder="AI & Big Data"
                        disabled={isSubmitting}
                    />
                    {errors.tergvvleh_chiglel && <p className="text-red-500 text-sm mt-1">{errors.tergvvleh_chiglel.message}</p>}
                </div>

                {/* 3. Шагнал */}
                <div>
                    <Label htmlFor="shagnal">Томоохон Шагнал / Амжилт *</Label>
                    <Input
                        id="shagnal"
                        {...register("shagnal", { required: "Шагнал заавал." })}
                        placeholder="Оны шилдэг тэнхим 2024"
                        disabled={isSubmitting}
                    />
                    {errors.shagnal && <p className="text-red-500 text-sm mt-1">{errors.shagnal.message}</p>}
                </div>

                {/* 4. Бүтээл */}
                <div>
                    <Label htmlFor="bvteel">Бүтээл / Эрдэм Шинжилгээний Ажил *</Label>
                    <Input
                        id="bvteel"
                        {...register("bvteel", { required: "Бүтээл заавал." })}
                        placeholder="Нийт 50 эрдмийн бүтээл"
                        disabled={isSubmitting}
                    />
                    {errors.bvteel && <p className="text-red-500 text-sm mt-1">{errors.bvteel.message}</p>}
                </div>

                {/* 5. Тайлбар (Optional) */}
                <div>
                    <Label htmlFor="tailbar">Нэмэлт Тайлбар</Label>
                    <Textarea
                        id="tailbar"
                        {...register("tailbar")}
                        placeholder="Тэнхимийн тухай товч мэдээлэл..."
                        disabled={isSubmitting}
                        rows={3}
                    />
                </div>

                {/* 6. Зураг (Image Upload логикийг одоогоор орхив) */}
                {/* <ImageUploadComponent /> */}

                <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                    {isSubmitting ? 'Хадгалж байна...' : `✅ ${id ? 'Өөрчлөлт Хадгалах' : 'Тэнхим Нэмэх'}`}
                </Button>
            </form>
        </div>
    );
}