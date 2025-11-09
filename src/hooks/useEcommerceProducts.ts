import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export function useEcommerceProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 12, category, search } = options;

  return useQuery({
    queryKey: ['ecommerce-products', page, limit, category, search],
    queryFn: async () => {
      const response = await productsApi.getAll();
      
      // Client-side filtering for now (can be moved to backend for scalability)
      let filtered = response.data || [];
      
      if (category && category !== 'all') {
        filtered = filtered.filter((p: any) => p.category === category);
      }
      
      if (search) {
        filtered = filtered.filter((p: any) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);

      return {
        products: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
