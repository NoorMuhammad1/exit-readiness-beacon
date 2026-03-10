import { useState, useCallback } from 'react';
import { mockCompanyData, mockDocuments } from '@/lib/mockDocuments';
import { toast } from 'sonner';

export const useSampleData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sampleDataLoaded, setSampleDataLoaded] = useState(false);

  const loadSampleData = async (userId: string) => {
    setIsLoading(true);

    try {
      // Backend doesn't have data room tables yet
      // For now, just mark as loaded in localStorage
      const sampleDataKey = `sample_data_${userId}`;
      const existingData = localStorage.getItem(sampleDataKey);

      if (existingData) {
        toast.info('Sample data already loaded');
        setSampleDataLoaded(true);
        return true;
      }

      // Store in localStorage to simulate loading
      localStorage.setItem(sampleDataKey, JSON.stringify({
        loaded: true,
        timestamp: new Date().toISOString(),
        documentCount: mockDocuments.length
      }));

      setSampleDataLoaded(true);
      toast.success(`Sample data loaded successfully! ${mockDocuments.length} documents.`);

      return true;

    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error('Failed to load sample data. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSampleData = async (userId: string) => {
    setIsLoading(true);

    try {
      const sampleDataKey = `sample_data_${userId}`;
      localStorage.removeItem(sampleDataKey);

      setSampleDataLoaded(false);
      toast.success('Sample data cleared successfully');
      return true;

    } catch (error) {
      console.error('Error clearing sample data:', error);
      toast.error('Failed to clear sample data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSampleDataExists = useCallback(async (userId: string) => {
    try {
      const sampleDataKey = `sample_data_${userId}`;
      const existingData = localStorage.getItem(sampleDataKey);

      const exists = !!existingData;
      setSampleDataLoaded(exists);
      return exists;
    } catch (error) {
      console.error('Error checking sample data:', error);
      return false;
    }
  }, []);

  return {
    isLoading,
    sampleDataLoaded,
    loadSampleData,
    clearSampleData,
    checkSampleDataExists
  };
};