import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://10.150.34.26:4000/api';

type Message = {
    content: string;
    type: 'success' | 'error';
};

export const TenhimCreateScreen: React.FC = () => {
    const { dispatch } = useAPIActions();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        ner: '',
        tergvvleh_chiglel: '',
        shagnal: '',
        bvteel: '',
        tailbar: '',
    });

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [detailImage, setDetailImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [detailPreview, setDetailPreview] = useState<string>('');
    const [message, setMessage] = useState<Message | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const detailInputRef = useRef<HTMLInputElement>(null);

    // 📸 ЗУРАГ СОНГОХ
    const handleImageSelect = (file: File, type: 'cover' | 'detail') => {
        if (!file.type.startsWith('image/')) {
            setMessage({ 
                content: 'Зөвхөн зураг файл сонгоно уу!', 
                type: 'error' 
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ 
                content: 'Зургийн хэмжээ 5MB-аас бага байх ёстой!', 
                type: 'error' 
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'cover') {
                setCoverImage(file);
                setCoverPreview(reader.result as string);
            } else {
                setDetailImage(file);
                setDetailPreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    // 📸 ЗУРАГ АРИЛГАХ
    const handleRemoveImage = (type: 'cover' | 'detail') => {
        if (type === 'cover') {
            setCoverImage(null);
            setCoverPreview('');
            if (coverInputRef.current) coverInputRef.current.value = '';
        } else {
            setDetailImage(null);
            setDetailPreview('');
            if (detailInputRef.current) detailInputRef.current.value = '';
        }
    };

    // 💾 ХАДГАЛАХ
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            
            // Текст талбарууд
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            // Зургууд
            if (coverImage) formDataToSend.append('coverImage', coverImage);
            if (detailImage) formDataToSend.append('detailImage', detailImage);

            // API дуудах
            const endpoint = (coverImage || detailImage)
                ? `${BASE_URL}/tenhim/upload`
                : `${BASE_URL}/tenhim`;

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Алдаа гарлаа');
            }

            dispatch({ type: 'ADD_TENHIM', payload: result.data });

            setMessage({
                content: `✅ Тэнхим "${result.data.ner}" амжилттай үүсгэгдлээ!`,
                type: 'success',
            });

            setTimeout(() => navigate('/tenhim'), 1500);
            
        } catch (error) {
            console.error("Тэнхим үүсгэхэд алдаа:", error);
            setMessage({
                content: error instanceof Error ? error.message : "Тэнхим бүртгэхэд алдаа гарлаа.",
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-3 sm:p-4 lg:p-8 max-w-4xl mx-auto">
            {/* 🔙 БУЦАХ ТОВЧ */}
            <button 
                onClick={() => navigate('/tenhim')}
                className="mb-6 flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition p-2 rounded hover:bg-orange-50"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm sm:text-base">Жагсаалт руу буцах</span>
            </button>
            
            {/* 📋 ГАРЧИГ */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">🏛️ Шинэ Тэнхим Үүсгэх</h1>
            
            {/* ✅ МЕССЭЖ */}
            {message && (
                <div 
                    className={`p-4 mb-6 rounded-lg font-semibold text-sm sm:text-base ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                >
                    {message.content}
                </div>
            )}
            
            {/* 📝 ФОРМ */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border">
                
                {/* 🖼️ ЗУРГУУДЫГ СОНГОХ */}
                <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">📸 Зургууд Сонгох</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* НҮҮР ЗУРАГ */}
                        <div>
                            <Label className="text-sm sm:text-base font-semibold mb-2 block">
                                Нүүр Зураг (Cover)
                            </Label>
                            
                            {!coverPreview ? (
                                <div 
                                    onClick={() => coverInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
                                >
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Нүүр зураг сонгох</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                                </div>
                            ) : (
                                <div className="relative border-2 border-orange-300 rounded-lg p-3 bg-orange-50">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage('cover')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <img 
                                        src={coverPreview} 
                                        alt="Нүүр Preview" 
                                        className="w-full h-40 sm:h-48 object-cover rounded-md"
                                    />
                                    <p className="text-xs text-orange-600 mt-2 text-center">✅ Сонгогдлоо</p>
                                </div>
                            )}
                            
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], 'cover')}
                                className="hidden"
                            />
                        </div>

                        {/* ҮНДСЭН ЗУРАГ */}
                        <div>
                            <Label className="text-sm sm:text-base font-semibold mb-2 block">
                                Үндсэн Зураг (Detail)
                            </Label>
                            
                            {!detailPreview ? (
                                <div 
                                    onClick={() => detailInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
                                >
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Үндсэн зураг сонгох</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                                </div>
                            ) : (
                                <div className="relative border-2 border-orange-300 rounded-lg p-3 bg-orange-50">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage('detail')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <img 
                                        src={detailPreview} 
                                        alt="Үндсэн Preview" 
                                        className="w-full h-40 sm:h-48 object-cover rounded-md"
                                    />
                                    <p className="text-xs text-orange-600 mt-2 text-center">✅ Сонгогдлоо</p>
                                </div>
                            )}
                            
                            <input
                                ref={detailInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], 'detail')}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* 📝 ТЕКСТ ТАЛБАРУУД */}
                <div className="space-y-4">
                    {/* ТЭНХИМИЙН НЭР */}
                    <div>
                        <Label htmlFor="ner" className="text-sm font-medium">
                            Тэнхимийн Нэр *
                        </Label>
                        <Input
                            id="ner"
                            value={formData.ner}
                            onChange={(e) => setFormData({ ...formData, ner: e.target.value })}
                            placeholder="Биологи, Химийн Тэнхим"
                            required
                            disabled={isSubmitting}
                            className="mt-1"
                        />
                    </div>

                    {/* ТЭРГҮҮЛЭХ ЧИГЛЭЛ */}
                    <div>
                        <Label htmlFor="tergvvleh_chiglel" className="text-sm font-medium">
                            Тэргүүлэх Чиглэл *
                        </Label>
                        <Input
                            id="tergvvleh_chiglel"
                            value={formData.tergvvleh_chiglel}
                            onChange={(e) => setFormData({ ...formData, tergvvleh_chiglel: e.target.value })}
                            placeholder="Биотехнологи ба эмнэлгийн судалгаа"
                            required
                            disabled={isSubmitting}
                            className="mt-1"
                        />
                    </div>

                    {/* ШАГНАЛ */}
                    <div>
                        <Label htmlFor="shagnal" className="text-sm font-medium">
                            Томоохон Шагнал / Амжилт
                        </Label>
                        <Input
                            id="shagnal"
                            value={formData.shagnal}
                            onChange={(e) => setFormData({ ...formData, shagnal: e.target.value })}
                            placeholder="Оны шилдэг тэнхим 2024"
                            disabled={isSubmitting}
                            className="mt-1"
                        />
                    </div>

                    {/* БҮТЭЭЛ */}
                    <div>
                        <Label htmlFor="bvteel" className="text-sm font-medium">
                            Бүтээл / Эрдэм Шинжилгээний Ажил
                        </Label>
                        <Textarea
                            id="bvteel"
                            value={formData.bvteel}
                            onChange={(e) => setFormData({ ...formData, bvteel: e.target.value })}
                            placeholder="Тэнхимийн хийсэн томоохон бүтээлүүдийг дурд."
                            disabled={isSubmitting}
                            rows={3}
                            className="mt-1"
                        />
                    </div>

                    {/* ТАЙЛБАР */}
                    <div>
                        <Label htmlFor="tailbar" className="text-sm font-medium">
                            Нэмэлт Тайлбар
                        </Label>
                        <Textarea
                            id="tailbar"
                            value={formData.tailbar}
                            onChange={(e) => setFormData({ ...formData, tailbar: e.target.value })}
                            placeholder="Тэнхимийн тухай товч мэдээлэл..."
                            disabled={isSubmitting}
                            rows={3}
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* 🔘 SUBMIT BUTTON */}
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-150 text-sm sm:text-base
                               bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '⏳ Үүсгэж байна...' : '✅ Тэнхим Үүсгэх'}
                </Button>
            </form>
        </div>
    );
};

export default TenhimCreateScreen;