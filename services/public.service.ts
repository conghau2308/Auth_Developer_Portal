import { publicApi } from '@/lib/api-client';

export const publicService = {
  getCountries: () => publicApi.get('/countries'),
  
  searchProducts: (query: string) => 
    publicApi.get('/products/search', { params: { q: query } }),
  
  getProductDetail: (id: string) => 
    publicApi.get(`/products/${id}`),
};