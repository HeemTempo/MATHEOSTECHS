import axiosInstance from './axiosInstance';

export interface AuditLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  description: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
}

export const auditLogApi = {
  getIncidentAuditLogs: async (incidentId: number): Promise<AuditLogsResponse> => {
    const response = await axiosInstance.get(`/incidents/${incidentId}/audit-log`);
    return response.data;
  },
};
