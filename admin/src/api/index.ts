// admin/src/api/index.ts - 8 COLLECTIONS CRUD

import type { 
    ApiResponse, 
    TenhimType, 
    MergejilType, 
    HamtarsanHutType, 
    TetgelegType,
    TulburType,
    VideoType,
    ContactInfoType,
    FeedbackType
} from './types'; 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://10.150.34.26:4000/api';

async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || data.message || `API Error: ${response.status}`);
        }

        if (data.data !== undefined) {
            return { data: data.data };
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// ===================================
// 1. TENHIM
// ===================================
export const getTenhim = async (): Promise<TenhimType[]> => {
    const res = await fetchData<TenhimType[]>('/tenhim');
    return Array.isArray(res.data) ? res.data : [];
};

export const getTenhimById = async (id: string): Promise<TenhimType> => {
    const res = await fetchData<TenhimType>(`/tenhim/${id}`);
    return res.data;
};

export const createTenhim = async (data: Omit<TenhimType, '_id' | 'createdAt' | 'updatedAt'>): Promise<TenhimType> => {
    const res = await fetchData<TenhimType>('/tenhim', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateTenhim = async (id: string, data: Partial<TenhimType>): Promise<TenhimType> => {
    const res = await fetchData<TenhimType>(`/tenhim/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteTenhim = async (id: string): Promise<void> => {
    await fetchData<void>(`/tenhim/${id}`, { method: 'DELETE' });
};

// ===================================
// 2. MERGEJIL
// ===================================
export const getMergejil = async (): Promise<MergejilType[]> => {
    const res = await fetchData<MergejilType[]>('/mergejil');
    return Array.isArray(res.data) ? res.data : [];
};

export const getMergejilById = async (id: string): Promise<ApiResponse<MergejilType>> => {
    const res = await fetch(`${BASE_URL}/mergejil/full/${id}`);
    if (!res.ok) throw new Error('Мэргэжил татахад алдаа');
    const data = await res.json();
    return { data: data.mergejil || data };
};

export const createMergejil = async (data: Omit<MergejilType, '_id' | 'createdAt' | 'updatedAt'>): Promise<MergejilType> => {
    const res = await fetchData<MergejilType>('/mergejil', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateMergejil = async (id: string, data: Partial<MergejilType>): Promise<MergejilType> => {
    const res = await fetchData<MergejilType>(`/mergejil/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteMergejil = async (id: string): Promise<void> => {
    await fetchData<void>(`/mergejil/${id}`, { method: 'DELETE' });
};

// ===================================
// 3. HAMTARSAN HUT
// ===================================
export const getHamtarsanHut = async (): Promise<HamtarsanHutType[]> => {
    const res = await fetchData<HamtarsanHutType[]>('/hamtarsan_hut');
    return Array.isArray(res.data) ? res.data : [];
};

export const getHamtarsanHutById = async (id: string): Promise<HamtarsanHutType> => {
    const res = await fetchData<HamtarsanHutType>(`/hamtarsan_hut/${id}`);
    return res.data;
};

export const createHamtarsanHut = async (data: Omit<HamtarsanHutType, '_id' | 'createdAt' | 'updatedAt'>): Promise<HamtarsanHutType> => {
    const res = await fetchData<HamtarsanHutType>('/hamtarsan_hut', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateHamtarsanHut = async (id: string, data: Partial<HamtarsanHutType>): Promise<HamtarsanHutType> => {
    const res = await fetchData<HamtarsanHutType>(`/hamtarsan_hut/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteHamtarsanHut = async (id: string): Promise<void> => {
    await fetchData<void>(`/hamtarsan_hut/${id}`, { method: 'DELETE' });
};

// ===================================
// 4. TETGELEG
// ===================================
export const getTetgeleg = async (): Promise<TetgelegType[]> => {
    const res = await fetchData<TetgelegType[]>('/tetgeleg');
    return Array.isArray(res.data) ? res.data : [];
};

export const getTetgelegById = async (id: string): Promise<TetgelegType> => {
    const res = await fetchData<TetgelegType>(`/tetgeleg/${id}`);
    return res.data;
};

export const createTetgeleg = async (data: Omit<TetgelegType, '_id' | 'createdAt' | 'updatedAt'>): Promise<TetgelegType> => {
    const res = await fetchData<TetgelegType>('/tetgeleg', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateTetgeleg = async (id: string, data: Partial<TetgelegType>): Promise<TetgelegType> => {
    const res = await fetchData<TetgelegType>(`/tetgeleg/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteTetgeleg = async (id: string): Promise<void> => {
    await fetchData<void>(`/tetgeleg/${id}`, { method: 'DELETE' });
};

export const getTulbur = async (): Promise<TulburType[]> => {
    const res = await fetchData<TulburType[]>('/tulbur');
    return Array.isArray(res.data) ? res.data : [];
};

export const getTulburById = async (id: string): Promise<TulburType> => {
    const res = await fetchData<TulburType>(`/tulbur/${id}`);
    return res.data;
};

export const createTulbur = async (data: Omit<TulburType, '_id' | 'createdAt' | 'updatedAt'>): Promise<TulburType> => {
    const res = await fetchData<TulburType>('/tulbur', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateTulbur = async (id: string, data: Partial<TulburType>): Promise<TulburType> => {
    const res = await fetchData<TulburType>(`/tulbur/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteTulbur = async (id: string): Promise<void> => {
    await fetchData<void>(`/tulbur/${id}`, { method: 'DELETE' });
};

// ===================================
// 6. VIDEO (ШИНЭЧЛЭГДСЭН)
// ===================================
export const getVideo = async (): Promise<VideoType[]> => {
    const res = await fetchData<VideoType[]>('/video');
    return Array.isArray(res.data) ? res.data : [];
};

export const getVideoById = async (id: string): Promise<VideoType> => {
    const res = await fetchData<VideoType>(`/video/${id}`);
    return res.data;
};

// POST - Энэ хэсгийг FormData хүлээж авдаг болгож өөрчлөв
export const createVideo = async (formData: FormData): Promise<VideoType> => {
    const response = await fetch(`${BASE_URL}/video`, {
        method: 'POST',
        // АНХААР: Header дотор 'Content-Type': 'application/json' байж БОЛОХГҮЙ
        body: formData, 
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Видео хуулахад алдаа гарлаа');
    
    return data.data || data;
};

// PUT - Энэ хэсгийг мөн адил FormData хүлээж авдаг болгож өөрчлөв
export const updateVideo = async (id: string, formData: FormData): Promise<VideoType> => {
    const response = await fetch(`${BASE_URL}/video/${id}`, {
        method: 'PUT',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Видео шинэчлэхэд алдаа гарлаа');
    
    return data.data || data;
};

export const deleteVideo = async (id: string): Promise<void> => {
    await fetchData<void>(`/video/${id}`, { method: 'DELETE' });
};
// ===================================
// 7. CONTACT INFO
// ===================================
export const getContactInfo = async (): Promise<ContactInfoType[]> => {
    const res = await fetchData<ContactInfoType[]>('/contactinfo');
    return Array.isArray(res.data) ? res.data : [];
};

export const getContactInfoById = async (id: string): Promise<ContactInfoType> => {
    const res = await fetchData<ContactInfoType>(`/contactinfo/${id}`);
    return res.data;
};

export const createContactInfo = async (data: Omit<ContactInfoType, '_id' | 'createdAt' | 'updatedAt'>): Promise<ContactInfoType> => {
    const res = await fetchData<ContactInfoType>('/contactinfo', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateContactInfo = async (id: string, data: Partial<ContactInfoType>): Promise<ContactInfoType> => {
    const res = await fetchData<ContactInfoType>(`/contactinfo/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteContactInfo = async (id: string): Promise<void> => {
    await fetchData<void>(`/contactinfo/${id}`, { method: 'DELETE' });
};

// ===================================
// 8. FEEDBACK
// ===================================
export const getFeedback = async (): Promise<FeedbackType[]> => {
    const res = await fetchData<FeedbackType[]>('/feedback');
    return Array.isArray(res.data) ? res.data : [];
};

export const getFeedbackById = async (id: string): Promise<FeedbackType> => {
    const res = await fetchData<FeedbackType>(`/feedback/${id}`);
    return res.data;
};

export const createFeedback = async (data: Omit<FeedbackType, '_id' | 'createdAt' | 'updatedAt'>): Promise<FeedbackType> => {
    const res = await fetchData<FeedbackType>('/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const updateFeedback = async (id: string, data: Partial<FeedbackType>): Promise<FeedbackType> => {
    const res = await fetchData<FeedbackType>(`/feedback/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res.data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
    await fetchData<void>(`/feedback/${id}`, { method: 'DELETE' });
};

// ===================================
// EXPORT TYPES
// ===================================
export * from './types';