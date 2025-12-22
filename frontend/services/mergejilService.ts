// frontend/services/mergejilService.ts
import { fetchData } from './apiClient';
import { MergejilType, ProgramDetailResponse } from './types';

const API_BASE_URL = 'http://10.150.34.26:4000/api/mergejil';

export const getAllMergejil = async (): Promise<MergejilType[]> => {
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data.data)) {
            return data.data as MergejilType[];
        }
        if (Array.isArray(data)) {
            return data as MergejilType[]; 
        }
        
        console.error('getAllMergejil: Unexpected response format', data);
        return [];
        
    } catch (err) {
        console.error('getAllMergejil алдаа:', err);
        return [];
    }
};

export const getMergejilById = async (id: string): Promise<any | null> => {
  try {
    // Алдаа өгөөд байгаа "/full/"-ийг хасаж, шууд ID-аар нь дуудна
    const url = `${API_BASE_URL}/${id}`; 
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    
    // Backend-ийн getSingleMergejil функц нь өгөгдлийг шууд объект хэлбэрээр 
    // эсвэл { data: {...} } гэж буцаадаг. Үүнийг шалгах:
    const finalData = data.data ? data.data : data;

    // Бидэнд "mergejil" гэсэн түлхүүр үг хэрэгтэй тул бүтцийг нь тааруулж буцаана
    return {
      mergejil: finalData,
      tetegleg: [], // /full зам биш учраас эдгээр нь хоосон ирнэ
      hamtarsanHutulbur: []
    };
  } catch (err) {
    console.error("getMergejilById алдаа:", err);
    return null;
  }
};