import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usersApi } from '../api/users';
import { USER_ROLES } from '../utils/constants';

const AdminUsersPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES.REPORTER as 'reporter' | 'operator' | 'admin',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const users = usersResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!', {
        description: `${formData.name} has been added to the system.`
      });
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: USER_ROLES.REPORTER,
      });
      setError('');
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.detail || 'Could not create user. Please try again.';
      setError(errorMsg);
      toast.error('Failed to create user', {
        description: errorMsg
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      is_active ? usersApi.activate(id) : usersApi.deactivate(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(
        variables.is_active ? 'User activated successfully!' : 'User deactivated successfully!',
        {
          description: variables.is_active 
            ? 'The user can now log in to the system.' 
            : 'The user can no longer log in to the system.'
        }
      );
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || 'Failed to update user status';
      toast.error('Operation failed', {
        description: errorMsg
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createMutation.mutate(formData);
  };

  return (
    <Layout>
      <PageHeader
        title="User Management"
        description="Manage system users and permissions"
        action={
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {showCreateForm ? 'Cancel' : 'Create User'}
          </button>
        }
      />

      {showCreateForm && (
        <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create New User</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'reporter' | 'operator' | 'admin' })}
                className="w-full px-3 py-2 bg-[#0f1117] border border-[#2e3149] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#1a1d27] border border-[#2e3149] rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#2e3149]">
            <thead className="bg-[#0f1117]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e3149]">
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({ id: user.id, is_active: !user.is_active })
                      }
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsersPage;
