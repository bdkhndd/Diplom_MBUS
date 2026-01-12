
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/config';
import { ApiResponse, DepartmentItem } from './types'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function fetchData<T>(endpoint: string): Promise<T> {
    try {
        const response = await apiClient.get<ApiResponse<T> | T>(endpoint); 
        const isSingleItemEndpoint = endpoint.match(/\/api\/tenhim\/[a-f\d]{24}$/i);

        if (isSingleItemEndpoint) {
            if (!response.data || (Object.keys(response.data as object).length === 0)) {
                throw new Error("ID-тай тохирох мэдээлэл Backend-д олдсонгүй.");
            }
            return response.data as T; 
        }
        const apiResponse = response.data as ApiResponse<T>;

        if (apiResponse && apiResponse.success === false) {
            throw new Error(apiResponse.message || `Амжилтгүй хүсэлт: ${response.status}`);
        }

        if (apiResponse && apiResponse.data !== undefined) {
            return apiResponse.data;
        }
        return response.data as T;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const apiError = error as AxiosError<ApiResponse<any>>;
            const message = apiError.response?.data?.message || apiError.response?.data?.error || apiError.message;
            throw new Error(`API Алдаа (${apiError.response?.status || 'Сүлжээ'}): ${message}`);
        }
        throw error;
    }
}

export const fetchDepartments = async (): Promise<DepartmentItem[]> => {
    try {
        const response = await apiClient.get<{ data: DepartmentItem[] }>(`/api/tenhim`); 

        const departmentList = response.data.data;
        
        if (Array.isArray(departmentList)) {
            return departmentList;
        } else {
            throw new Error("Жагсаалт API-аас буруу төрлийн мэдээлэл ирлээ.");
        }
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};