
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/config';
import { ApiResponse, DepartmentItem } from './types'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// АДМИН-Д ХЭРЭГЛЭДЭГ fetchData-ийн АДИЛ ФУНКЦ
// 'T' нь татагдаж буй объектын төрөл (жишээ нь: DepartmentItem)
export async function fetchData<T>(endpoint: string): Promise<T> {
    try {
        // Response type-ийг өргөтгөв: { success, data } эсвэл шууд T
        const response = await apiClient.get<ApiResponse<T> | T>(endpoint); 
        
        // 1. ID-гаар татаж байгаа эсэхийг шалгах (/api/tenhim/ID)
        // Энэ нь таны getSingleTenhim функцийн шууд хариуг барих зориулалттай
        const isSingleItemEndpoint = endpoint.match(/\/api\/tenhim\/[a-f\d]{24}$/i);

        if (isSingleItemEndpoint) {
            // Frontend: Controller шууд T буюу { ner: '...', ... } объектоор буцаадаг.
            
            // Хоосон эсвэл null хариуг барих (Backend-д ID олдсонгүй)
            if (!response.data || (Object.keys(response.data as object).length === 0)) {
                throw new Error("ID-тай тохирох мэдээлэл Backend-д олдсонгүй.");
            }

            // Шууд объектыг буцаана (T type)
            return response.data as T; 
        }

        // 2. Жагсаалт эсвэл Admin-ийн Response загварыг шалгах ({ success: true, data: [...] })
        const apiResponse = response.data as ApiResponse<T>;

        if (apiResponse && apiResponse.success === false) {
            // Backend 200 статустай ч success: false ирвэл
            throw new Error(apiResponse.message || `Амжилтгүй хүсэлт: ${response.status}`);
        }
        
        // data field-ийг буцаах (Жагсаалт эсвэл Admin POST/PUT)
        if (apiResponse && apiResponse.data !== undefined) {
            return apiResponse.data;
        }

        // Хэрэв API загвар зөрчсөн ч ямар нэг data ирсэн бол (бага магадлалтай)
        return response.data as T;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const apiError = error as AxiosError<ApiResponse<any>>;
            
            // Алдааны мэдээллийг илүү тодорхой болгох (Controller-ийн { error: '...' } -г барих)
            const message = apiError.response?.data?.message || apiError.response?.data?.error || apiError.message;
            throw new Error(`API Алдаа (${apiError.response?.status || 'Сүлжээ'}): ${message}`);
        }
        throw error;
    }
}

// 💡 Тэмдэглэл: Хэрэв та fetchDepartments функцийг өөр файл руу зөөсөн бол, 
// түүнийг ашиглаж буй tenhimService.ts-ийн кодыг шалгана уу.

// --- (Жагсаалт татах функц - Хэрэв танд хэрэгтэй бол) ---

export const fetchDepartments = async (): Promise<DepartmentItem[]> => {
    try {
        // API-ийн хариу: { data: [...] }
        const response = await apiClient.get<{ data: DepartmentItem[] }>(`/api/tenhim`); 

        const departmentList = response.data.data;
        
        if (Array.isArray(departmentList)) {
            return departmentList;
        } else {
            throw new Error("Жагсаалт API-аас буруу төрлийн мэдээлэл ирлээ.");
        }
    } catch (error) {
        // catch logic-ийг fetchData дээрх шиг давтан ашиглах эсвэл зөвхөн error-ийг дамжуулах
        console.error("Error fetching departments:", error);
        throw error;
    }
};