// frontend/services/hamtarsan_hutService.ts
import { hamtarsan_hut, ProgramDetailResponse } from './types';

const API_BASE_URL = 'http://10.150.34.26:4000/api/hamtarsan_hut';

/**
 * Бүх хамтарсан хөтөлбөрүүдийг авах
 * Backend-ээс mergejilId-г populate хийсэн массив хүлээн авна.
 */
export const getAllCollab = async () => {
  try {
    const res = await fetch('http://10.150.34.26:4000/api/hamtarsan_hut');
    const result = await res.json();

    // АЛДАА ЗАСАХ ХЭСЭГ:
    // Хэрэв result нь { data: [...] } бол массив руу нь хандах
    if (result && result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    // Хэрэв шууд массив бол
    if (Array.isArray(result)) {
      return result;
    }

    return []; // Алдаа гарвал хоосон массив буцаана
  } catch (err) {
    console.error("Алдаа:", err);
    return [];
  }
};

/**
 * ID-аар дэлгэрэнгүй мэдээлэл авах
 */
export const getCollabById = async (id: string): Promise<ProgramDetailResponse | null> => {
    if (!id) return null;

    try {
        const url = `${API_BASE_URL}/full/${id}`;
        const res = await fetch(url);

        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`[hamtarsan_hut SERVICE] ID ${id} олдсонгүй.`);
                return null;
            }
            throw new Error(`HTTP error: ${res.status} (${res.statusText})`);
        }

        const data = await res.json();

        if (!data || !data.hamtarsan_hut) { 
            console.error('API response буруу format: hamtarsan_hut талбар дутуу байна.', data);
            return null;
        }

        return data as ProgramDetailResponse;

    } catch (err) {
        console.error('getCollabById алдаа:', err);
        return null;
    }
};