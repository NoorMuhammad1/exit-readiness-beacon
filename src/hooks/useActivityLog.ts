import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface ActivityLogEntry {
  id: string;
  action_type: string;
  details: string | null;
  action_metadata: any;
  user_id: string | null;
  company_id: string | null;
  created_at: string;
}

export const useActivityLog = (filters?: { companyId?: string; userId?: string }) => {
  return useQuery({
    queryKey: ['activity-log', filters],
    queryFn: async () => {
      const response = await apiClient.getActivityLogs(1, 50);
      let logs = response.logs;

      // Apply filters client-side
      if (filters?.companyId) {
        logs = logs.filter((log: any) => log.company_id === filters.companyId);
      }

      if (filters?.userId) {
        logs = logs.filter((log: any) => log.user_id === filters.userId);
      }

      return logs as ActivityLogEntry[];
    },
  });
};