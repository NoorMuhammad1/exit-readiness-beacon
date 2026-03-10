import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  created_at: string;
  updated_at: string;
  role?: {
    id: string;
    name: string;
    permissions: any;
  };
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Backend doesn't have a profiles endpoint yet
      // Return empty array for now
      return [] as UserProfile[];
    },
  });
};

export const useProfileStats = () => {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      // Backend doesn't have profile stats endpoint yet
      // Return default stats
      return {
        total: 0,
        admins: 0,
      };
    },
  });
};