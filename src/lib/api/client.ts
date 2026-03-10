// API Client for MongoDB Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role?: 'admin' | 'client';
  }) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe() {
    return this.request<{
      id: string;
      email: string;
      fullName: string;
      role: string;
    }>('/auth/me');
  }

  // File endpoints
  async uploadFile(file: File, category?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }

    const url = `${this.baseUrl}/files/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async getFiles(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<{ files: any[] }>(`/files${query}`);
  }

  async downloadFile(fileId: string) {
    const url = `${this.baseUrl}/files/${fileId}/download`;
    const response = await fetch(url, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async deleteFile(fileId: string) {
    return this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Inquiry endpoints
  async createInquiry(data: any) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInquiries() {
    return this.request<{ inquiries: any[] }>('/inquiries');
  }

  async updateInquiry(id: string, data: any) {
    return this.request(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInquiry(id: string) {
    return this.request(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  }

  // Financial assessment endpoints
  async createAssessment(data: any) {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAssessments() {
    return this.request<{ assessments: any[] }>('/assessments');
  }

  async updateAssessment(id: string, data: any) {
    return this.request(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Progress endpoints
  async updateProgress(data: {
    weekNumber: number;
    moduleName: string;
    moduleId: string;
    completed: boolean;
    data?: any;
  }) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProgress(weekNumber?: number) {
    const query = weekNumber ? `?weekNumber=${weekNumber}` : '';
    return this.request<{ progress: any[] }>(`/progress${query}`);
  }

  // Activity log endpoints
  async logActivity(data: {
    action: string;
    resource?: string;
    resourceId?: string;
    metadata?: any;
  }) {
    return this.request('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActivityLogs(page = 1, limit = 50) {
    return this.request<{
      logs: any[];
      pagination: any;
    }>(`/activity?page=${page}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
