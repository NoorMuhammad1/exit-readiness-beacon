import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactInquiry {
  id: string;
  company_name: string;
  industry: string | null;
  annual_revenue: number | null;
  contact_name: string | null;
  contact_email: string;
  status: string;
  exit_timeline: string | null;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
  source_form_version: string | null;
}

export const useInquiries = (filters?: { status?: string; industry?: string }) => {
  return useQuery({
    queryKey: ['inquiries', filters],
    queryFn: async () => {
      const response = await apiClient.getInquiries();
      let inquiries = response.inquiries;

      // Apply filters client-side
      if (filters?.status) {
        inquiries = inquiries.filter(i => i.status === filters.status);
      }

      if (filters?.industry) {
        inquiries = inquiries.filter(i => i.industry === filters.industry);
      }

      return inquiries as ContactInquiry[];
    },
  });
};

export const useInquiry = (id: string) => {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      const response = await apiClient.getInquiries();
      const inquiry = response.inquiries.find((i: any) => i.id === id);
      if (!inquiry) throw new Error('Inquiry not found');
      return inquiry as ContactInquiry;
    },
    enabled: !!id,
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContactInquiry> }) => {
      const response = await apiClient.updateInquiry(id, updates);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: "Success",
        description: "Company inquiry updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update inquiry: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inquiryId: string) => {
      await apiClient.deleteInquiry(inquiryId);
      return inquiryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['inquiry-stats'] });
      toast({
        title: "Success",
        description: "Company and all related data deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete company: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useInquiryStats = () => {
  return useQuery({
    queryKey: ['inquiry-stats'],
    queryFn: async () => {
      const response = await apiClient.getInquiries();
      const inquiries = response.inquiries;

      const totalCount = inquiries.length;
      const pendingCount = inquiries.filter((i: any) => i.status === 'new').length;

      const revenueData = inquiries.filter((i: any) => i.annual_revenue != null);
      const avgRevenue = revenueData.length > 0
        ? revenueData.reduce((sum: number, item: any) => sum + (item.annual_revenue || 0), 0) / revenueData.length
        : 0;

      console.log('Inquiry stats:', { totalCount, pendingCount, avgRevenue });

      return {
        total: totalCount,
        pending: pendingCount,
        avgRevenue: Math.round(avgRevenue),
      };
    },
  });
};