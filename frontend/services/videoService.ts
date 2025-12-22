import { VideoType } from './types';

// API хаягийг шууд энд зааж өгснөөр бусад файлаас хамааралгүй ажиллана
export const API_BASE_URL = 'http://10.150.34.26:4000/api/video';

/**
 * Бүх видеонуудыг авах
 */
export const getAllVideos = async (): Promise<VideoType[]> => {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Хариу JSON мөн эсэхийг шалгах
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("[VIDEO SERVICE] Серверээс текст ирлээ:", text);
      throw new Error("JSON биш өгөгдөл ирлээ.");
    }

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const result = await res.json();
    
    // Backend { data: [...] } эсвэл шууд [...] буцаадаг бол алийг нь ч хүлээж авна
    const videos = result.data || result;
    
    return Array.isArray(videos) ? videos : [];
  } catch (err) {
    console.error('[VIDEO SERVICE] getAllVideos алдаа:', err);
    return [];
  }
};

/**
 * ID-аар нэг видеог авах
 */
export const getVideoById = async (id: string): Promise<VideoType | null> => {
  if (!id) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) return null;
    
    const result = await res.json();
    return result.data || result;
  } catch (err) {
    console.error('[VIDEO SERVICE] getVideoById алдаа:', err);
    return null;
  }
};
