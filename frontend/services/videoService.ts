import { VideoType } from './types';

export const API_BASE_URL = 'http://192.168.1.3:4000/api/video';

export const getAllVideos = async (): Promise<VideoType[]> => {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("[VIDEO SERVICE] Серверээс текст ирлээ:", text);
      throw new Error("JSON биш өгөгдөл ирлээ.");
    }

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const result = await res.json();
    
    const videos = result.data || result;
    
    return Array.isArray(videos) ? videos : [];
  } catch (err) {
    console.error('[VIDEO SERVICE] getAllVideos алдаа:', err);
    return [];
  }
};

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
