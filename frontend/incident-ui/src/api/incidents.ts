import axiosInstance from './axiosInstance';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  assigned_user: {
    id: string;
    name: string;
    email: string;
  } | null;
  comments?: Comment[];
  updates?: IncidentUpdate[];
  created_at: string;
  updated_at: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  old_status: string;
  new_status: string;
  updated_by: string;
  updater: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface Comment {
  id: string;
  incident_id: string;
  user_id: string;
  comment: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface IncidentsResponse {
  success: boolean;
  message: string;
  data: Incident[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface IncidentResponse {
  success: boolean;
  message: string;
  data: Incident;
}

export interface CreateIncidentData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IncidentFilters {
  status?: string;
  severity?: string;
  assigned_to?: string;
  reported_by?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  assigned_only?: string;
}

export const incidentsApi = {
  getAll: async (filters?: IncidentFilters): Promise<IncidentsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axiosInstance.get(`/incidents?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Incident> => {
    const response = await axiosInstance.get(`/incidents/${id}`);
    return response.data.data; // Extract data from response
  },

  create: async (data: CreateIncidentData): Promise<IncidentResponse> => {
    const response = await axiosInstance.post('/incidents', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<IncidentResponse> => {
    const response = await axiosInstance.put(`/incidents/${id}/status`, { status });
    return response.data;
  },

  assign: async (id: string, assigned_to: string): Promise<IncidentResponse> => {
    const response = await axiosInstance.put(`/incidents/${id}/assign`, { assigned_to });
    return response.data;
  },
};
