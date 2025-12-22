import { TulburType } from './types'; // Төрлүүдээ хадгалсан файлаас импортлох

const API_BASE_URL = 'http://10.150.34.26:4000/api/tulbur';


export const getAllTulbur = async (): Promise<TulburType[]> => {
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data.data)) {
            return data.data as TulburType[];
        }
        
        if (Array.isArray(data)) {
            return data as TulburType[]; 
        }
        
        console.error('getAllTulbur: Unexpected response format', data);
        return [];
        
    } catch (err) {
        console.error('getAllTulbur алдаа:', err);
        return [];
    }
};


export const updateTulbur = async (id: string, updateData: Partial<TulburType>): Promise<TulburType | null> => {
    try {
        const url = `${API_BASE_URL}/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error → status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.success) {
            return data.data as TulburType;
        }

        return data as TulburType;

    } catch (err) {
        console.error("updateTulbur алдаа:", err);
        return null;
    }
};