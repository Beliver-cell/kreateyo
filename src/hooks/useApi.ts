import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  productsApi, 
  servicesApi, 
  ordersApi, 
  appointmentsApi,
  postsApi,
  customersApi,
  analyticsApi,
  filesApi
} from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });
};

// Services hooks
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: "Service created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create service", variant: "destructive" });
    },
  });
};

// Orders hooks
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });
};

// Appointments hooks
export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Appointment created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create appointment", variant: "destructive" });
    },
  });
};

export const useJoinZoomMeeting = () => {
  return useMutation({
    mutationFn: appointmentsApi.joinZoom,
    onSuccess: (data) => {
      window.open(data.startUrl, '_blank');
      toast({ title: "Opening Zoom meeting..." });
    },
    onError: () => {
      toast({ title: "Failed to join Zoom meeting", variant: "destructive" });
    },
  });
};

// Posts hooks
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: "Post created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create post", variant: "destructive" });
    },
  });
};

// Customers hooks
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll,
  });
};

// Analytics hooks
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getOverview,
  });
};

// Files hooks
export const useFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: filesApi.getAll,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: filesApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({ title: "File uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Failed to upload file", variant: "destructive" });
    },
  });
};
