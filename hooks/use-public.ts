import { useQuery } from '@tanstack/react-query';
import { publicService } from '@/services/public.service';

export const useCountries = () => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: publicService.getCountries,
        staleTime: 60 * 60 * 1000, // 1 giờ - data ít thay đổi
    });
};

export const useProductSearch = (query: string) => {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: () => publicService.searchProducts(query),
        enabled: query.length >= 3, // Chỉ search khi >= 3 ký tự
    });
};