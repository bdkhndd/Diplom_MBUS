// frontend/services/contactService.ts

const API_BASE_URL = 'http://10.150.34.26:4000';
const REQUEST_TIMEOUT = 10000;
import axios from "axios";
export interface ContactInfoType {
    _id: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    facebook?: string;
    instagram?: string;
    workingHours: {
        weekdays: string;
        weekend: string;
    };
    departments: Array<{
        name: string;
        phone: string;
    }>;
    emergencyContacts: Array<{
        name: string;
        phone: string;
    }>;
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface FeedbackType {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status?: 'new' | 'read' | 'replied' | 'archived';
    createdAt?: string;
}

function createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout'));
        }, timeoutMs);
    });
}

/**
 * Холбоо барих мэдээлэл татах
 */
export const getContactInfo = async (): Promise<ContactInfoType | null> => {
    try {
        console.log("==> Холбоо барих мэдээлэл татаж байна...");
        const response = await fetch(`${API_BASE_URL}/api/contactinfo`);
        
        if (!response.ok) {
            throw new Error(`HTTP алдаа: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Backend-ээс Array ирж байгаа тул эхний элементийг авна
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            console.log("==> ✅ Холбоо барих мэдээлэл амжилттай татагдлаа");
            return result.data[0] as ContactInfoType; // [0] гэж эхний объектыг зааж өгнө
        } 
        // Хэрэв шууд объект байвал:
        else if (result.data && !Array.isArray(result.data)) {
            return result.data as ContactInfoType;
        }
        
        return null;
        
    } catch (error: any) {
        console.error('==> ⛔ getContactInfo алдаа:', error.message);
        throw new Error(`Холбоо барих мэдээлэл татаж чадсангүй: ${error.message}`);
    }
};

/**
 * Санал хүсэлт илгээх
 */
const API_URL = 'http://10.150.34.26:4000/api/feedback';
export const sendFeedback = async (feedbackData: any) => {
    try {
        const response = await axios.post(API_URL, feedbackData);
        // Таны backend 'res.status(201).json({ data: feedback })' буцааж байгаа
        return response.data; 
    } catch (error: any) {
        console.error('Feedback илгээхэд алдаа гарлаа:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Сервертэй холбогдоход алдаа гарлаа');
    }
};