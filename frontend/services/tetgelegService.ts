import { TetgelegType } from './types'; 

function createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout: Хүсэлт хэт удаж байна'));
        }, timeoutMs);
    });
}

export async function getTetgeleg(): Promise<any[]> {
  try {
    const res = await fetch('http://10.150.34.26:4000/api/tetgeleg');
    const result = await res.json();
    
    if (result && result.data) {
      return result.data; 
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}