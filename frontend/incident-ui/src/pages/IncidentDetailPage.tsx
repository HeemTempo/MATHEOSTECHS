import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { SeverityBadge } from '../components/SeverityBadge';
import { incidentsApi } from '../api/incidents';
import { commentsApi } from '../api/comments';
import { usersApi } from '../api/users';
import { useAuthStore } from '../store/authStore';
import { INCIDENT_STATUS, USER_ROLES, STATUS_WORKFLOW } from '../utils/constants';

const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<'open' | 'investigating' | 'resolved' | 'closed'>(INCIDENT_STATUS.OPEN);
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [statusChangeComment, setStatusChangeComment] = useState('');

  const { data: incident, isLoading, isError } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => incidentsApi.getById(Number(id)),
    enabled: !!id,
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    enabled: user?.role === USER_ROLES.ADMIN,
  });

  const users = usersResponse?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => incidentsApi.updateStatus(Number(id), newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      toast.success('Status updated successfully!', {
        description: `Incident status changed to ${status}.`
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update status', {
        description: error?.response?.data?.message || 'Please try again later.'
      });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (userId: number) => incidentsApi.assign(Number(id), userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      toast.success('Incident assigned successfully!', {
        description: 'The incident has been assigned to the selected user.'
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error('Failed to assign incident', {
        description: error?.response?.data?.message || 'Please try again later.'
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => commentsApi.create(Number(id), comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      toast.success('Comment added successfully!');
      setCommentContent('');
    },
    onError: (error: any) => {
      toast.error('Failed to add comment', {
        description: error?.response?.data?.message || 'Please try again later.'
      });
    },
  });

  const handleEdit = () => {
    if (incident) {
      setStatus(incident.status);
      setAssignedToId(incident.assigned_user?.id || null);
      setIsEditing(true);
    }
  };

  // Get available next statuses based on current status
  const getAvailableStatuses = (currentStatus: string) => {
    const nextStatuses = STATUS_WORKFLOW[currentStatus as keyof typeof STATUS_WORKFLOW] || [];
    return [currentStatus, ...nextStatuses];
  };

  const handleUpdateStatus = async () => {
    if (status !== incident?.status) {
      try {
        // First update the status
        await updateStatusMutation.mutateAsync(status);
        
        // Then add comment if provided
        if (statusChangeComment.trim()) {
          await addCommentMutation.mutateAsync(statusChangeComment);
          setStatusChangeComment('');
        }
      } catch (error) {
        // Error already handled by mutation onError
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleAssign = () => {
    if (assignedToId && assignedToId !== incident?.assigned_user?.id) {
      assignMutation.mutate(assignedToId);
    } else {
      setIsEditing(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      addCommentMutation.mutate(commentContent);
    }
  };

  const canEdit = user?.role === USER_ROLES.ADMIN || 
    (user?.role === USER_ROLES.OPERATOR && incident?.assigned_user?.id === user?.id);
  const canAssign = user?.role === USER_ROLES.ADMIN;
  const canComment = user?.role === USER_ROLES.ADMIN || 
    (user?.role === USER_ROLES.OPERATOR && incident?.assigned_user?.id === user?.id);

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  
  if (isError || !incident) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Incident Not Found</h2>
            <p className="text-slate-400 mb-6">
              {user?.role === 'reporter' 
                ? "You don't have permission to view this incident, or it doesn't exist."
                : "This incident doesn't exist or has been deleted."}
            </p>
            <button
              onClick={() => navigate('/incidents')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Back to Incidents
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title={incident.title}
        action={
          canEdit && !isEditing && (
            <button
              onClick={handleEdit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Edit
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{incident.description}</p>
          </div>

          <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Comments</h2>
            
            {canComment && (
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
                <button
                  type="submit"
                  disabled={addCommentMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Add Comment
                </button>
              </form>
            )}

            <div className="space-y-4">
              {incident.comments?.map((comment) => (
                <div key={comment.id} className="border-t border-[#2e3149] pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white font-medium">{comment.user?.name}</span>
                      <span className="text-slate-400 text-sm ml-2">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300">{comment.content}</p>
                </div>
              ))}
              {(!incident.comments || incident.comments.length === 0) && (
                <p className="text-slate-400 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'open' | 'investigating' | 'resolved' | 'closed')}
                    className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {getAvailableStatuses(incident.status).map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  {status !== incident.status && (
                    <p className="text-xs text-slate-400 mt-1">
                      Workflow: open → investigating → resolved → closed
                    </p>
                  )}
                </div>

                {/* Comment field when changing status */}
                {status !== incident.status && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Add Comment (Optional)
                    </label>
                    <textarea
                      value={statusChangeComment}
                      onChange={(e) => setStatusChangeComment(e.target.value)}
                      placeholder="Add a comment about this status change..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {canAssign && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Assign To</label>
                    <select
                      value={assignedToId || ''}
                      onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Unassigned</option>
                      {users?.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-2">
                  {status !== incident.status && (
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                    </button>
                  )}
                  {canAssign && assignedToId && assignedToId !== incident.assigned_user?.id && (
                    <button
                      onClick={handleAssign}
                      disabled={assignMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                    </button>
                  )}
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <StatusBadge status={incident.status} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Severity</div>
                  <SeverityBadge severity={incident.severity} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Reporter</div>
                  <div className="text-white">{incident.reporter?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Assigned To</div>
                  <div className="text-white">{incident.assigned_user?.name || 'Unassigned'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Created</div>
                  <div className="text-white">{new Date(incident.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Updated</div>
                  <div className="text-white">{new Date(incident.updated_at).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IncidentDetailPage;
