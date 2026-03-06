import axiosInstance from './axiosInstance';

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  user: {
    id: string;
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
  getIncidentAuditLogs: async (incidentId: string): Promise<AuditLogsResponse> => {
    const response = await axiosInstance.get(`/incidents/${incidentId}/audit-log`);
    return response.data;
  },
};
