import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  // Company Basics
  companyName: string;
  industry: string;
  founded: string;
  employees: string;
  
  // Financial
  revenue2025: string;
  revenue2024: string;
  revenue2023: string;
  revenue2022: string;
  
  // Investment & Structure
  investmentType: string;
  entityType: string;
  ownershipType: string;
  owners: Array<{ name: string; percentage: string }>;
  
  // Document Availability
  pnlAvailability: string;
  taxReturnsAvailability: string;
  balanceSheetsAvailability: string;
  
  // Goals & Challenges
  exitTimeline: string;
  exitType: string;
  currentChallenges: string;
  
  // Contact Info
  email: string;
  phone?: string;
  companyWebsite?: string;
  preferredContact: string;
  
  // Add-backs for EBITDA normalization
  addBacks?: {
    personalVehicles: { selected: boolean; notes: string };
    familySalaries: { selected: boolean; notes: string };
    ownerInsurance: { selected: boolean; notes: string };
    travelEntertainment: { selected: boolean; notes: string };
    personalProperty: { selected: boolean; notes: string };
    professionalServices: { selected: boolean; notes: string };
    discretionarySpending: { selected: boolean; notes: string };
    other: { selected: boolean; notes: string };
  };

  // Enhanced fields
  jobTitle?: string;
  companySize?: string;
  howDidYouHear?: string;
}

export const useContactSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitContact = async (formData: ContactFormData, ndaRecordId?: string) => {
    setIsSubmitting(true);

    try {
      console.log('Starting contact submission with data:', {
        email: formData.email,
        companyName: formData.companyName,
        ndaRecordId
      });

      // Get user's IP address
      let ip = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ip = ipData.ip;
        console.log('Got IP address:', ip);
      } catch (e) {
        console.warn('Failed to get IP address:', e);
      }

      const inquiryData = {
        companyName: formData.companyName,
        contactName: formData.jobTitle || 'Unknown',
        email: formData.email,
        phone: formData.phone || '',
        message: `
Industry: ${formData.industry}
Founded: ${formData.founded}
Employees: ${formData.employees}
Revenue 2025: ${formData.revenue2025}
Exit Timeline: ${formData.exitTimeline}
Exit Type: ${formData.exitType}
Current Challenges: ${formData.currentChallenges}
        `.trim(),
      };

      const data = await apiClient.createInquiry(inquiryData);

      // Store submission for local access
      localStorage.setItem('meridian_assessment_submitted', JSON.stringify({
        id: data.inquiry?.id,
        submittedAt: new Date().toISOString(),
        companyName: formData.companyName
      }));

      toast({
        title: "Assessment Submitted",
        description: "Thank you! We'll review your information and contact you within 24 hours.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Contact submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContact,
    isSubmitting
  };
};