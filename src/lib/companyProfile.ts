
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'company-profile-v1';

export interface CompanyProfile {
  companyName: string;
  industry: string;
  yearFounded: number;
  employeeCount: number;
  city: string;
  state: string;
  annualRevenue: number;
  ebitda: number;
  ebitdaMargin: number;
  grossMarginPercent: number;
  revenueGrowthRate: number;
  transactionType: string;
  exitTimeline: string;
  customerCount: number;
  top10CustomerConcentration: number;
  businessModel: string;
}

export const emptyProfile: CompanyProfile = {
  companyName: '',
  industry: '',
  yearFounded: 0,
  employeeCount: 0,
  city: '',
  state: '',
  annualRevenue: 0,
  ebitda: 0,
  ebitdaMargin: 0,
  grossMarginPercent: 0,
  revenueGrowthRate: 0,
  transactionType: '',
  exitTimeline: '',
  customerCount: 0,
  top10CustomerConcentration: 0,
  businessModel: '',
};

// Read the profile from localStorage
export function getCompanyProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyProfile };
    return { ...emptyProfile, ...JSON.parse(raw) };
  } catch {
    return { ...emptyProfile };
  }
}

// Save the full profile to localStorage
export function saveCompanyProfile(profile: CompanyProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Update specific fields without overwriting others
export function updateCompanyProfile(partial: Partial<CompanyProfile>): CompanyProfile {
  const current = getCompanyProfile();
  const updated = { ...current, ...partial };
  saveCompanyProfile(updated);
  return updated;
}

// React hook — components can read and update the profile
export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(getCompanyProfile);

  // Listen for changes from other components via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProfile(getCompanyProfile());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const update = useCallback((partial: Partial<CompanyProfile>) => {
    const updated = updateCompanyProfile(partial);
    setProfile(updated);
  }, []);

  const save = useCallback((full: CompanyProfile) => {
    saveCompanyProfile(full);
    setProfile(full);
  }, []);

  return { profile, update, save };
}
