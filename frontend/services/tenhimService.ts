
import { fetchData } from './apiClient';
import { TenhimType } from './types'; 

// const TENHIM_API_URL = 'http://172.20.10.3:4000/api/tenhim';
export const getTenhim = () => fetchData<TenhimType[]>('/api/tenhim');

// export const getTenhimById = (id: string) => fetchData<TenhimType>(`/api/tenhim/${id}`);
// services/tenhimService.ts доторх хаягийг баталгаажуул
 // 172... IP хаягаа ашигла

export const getTenhimById = async (id: string) => {
  const res = await fetch(`http://10.150.34.26:4000/api/tenhim/${id}`);
  const result = await res.json();
  
  // ХЭРЭВ Backend { data: {...} } гэж буцааж байвал:
  if (result && result.data) {
    return result.data; 
  }
  return result; // Эсвэл шууд объект бол
};

