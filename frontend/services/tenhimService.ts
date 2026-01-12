
import { fetchData } from './apiClient';
import { TenhimType } from './types'; 

export const getTenhim = () => fetchData<TenhimType[]>('/api/tenhim');



export const getTenhimById = async (id: string) => {
  const res = await fetch(`http://192.168.1.3:4000/api/tenhim/${id}`);
  const result = await res.json();
  
  if (result && result.data) {
    return result.data; 
  }
  return result; 
};

