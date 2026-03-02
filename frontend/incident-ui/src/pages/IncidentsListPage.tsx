import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { PageHeader } from '../components/PageHeader';
import { IncidentTable } from '../components/IncidentTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { incidentsApi } from '../api/incidents';
import { useAuthStore } from '../store/authStore';
import { INCIDENT_STATUS, INCIDENT_SEVERITY, USER_ROLES } from '../utils/constants';

export function IncidentsListPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    search: '',
    page: 1,
    per_page: 15,
  });

  const isOperator = user?.role === USER_ROLES.OPERATOR;
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data, isLoading } = useQuery({
    queryKey: ['incidents', filters, activeTab],
    queryFn: () => {
      // Convert 'all' to empty string for API
      const apiFilters = {
        ...filters,
        status: filters.status === 'all' ? '' : filters.status,
        severity: filters.severity === 'all' ? '' : filters.severity,
      };
      return incidentsApi.getAll(apiFilters);
    },
  });

  // Filter incidents based on tab (for admin only)
  const allIncidents = data?.data || [];
  const incidents = isAdmin && activeTab === 'history'
    ? allIncidents.filter(i => i.status === 'closed')
    : allIncidents.filter(i => i.status !== 'closed');

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div>
      <PageHeader
        title={isOperator ? "My Assigned Incidents" : activeTab === 'history' ? "Incident History" : "Incidents"}
        description={
          isOperator 
            ? "Incidents assigned to you" 
            : activeTab === 'history' 
            ? "Closed incidents history" 
            : "View and manage all incidents"
        }
        action={
          user?.role !== USER_ROLES.OPERATOR && activeTab === 'active' && (
            <Link to="/incidents/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Incident
              </Button>
            </Link>
          )
        }
      />

      {/* Tabs for Admin */}
      {isAdmin && (
        <div className="mb-6 border-b border-[#2e3149]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Incidents ({allIncidents.filter(i => i.status !== 'closed').length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              History ({allIncidents.filter(i => i.status === 'closed').length})
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search incidents..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-sm bg-[#1a1d27] border-[#2e3149] text-white"
        />
        
        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
          <SelectTrigger className="w-[180px] bg-[#1a1d27] border-[#2e3149] text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(INCIDENT_STATUS).map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.severity} onValueChange={(v) => handleFilterChange('severity', v)}>
          <SelectTrigger className="w-[180px] bg-[#1a1d27] border-[#2e3149] text-white">
            <SelectValue placeholder="All Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            {Object.values(INCIDENT_SEVERITY).map(severity => (
              <SelectItem key={severity} value={severity}>{severity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? <LoadingSpinner /> : <IncidentTable incidents={incidents} />}

      {/* Pagination */}
      {data?.meta && data.meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-slate-400">
            Page {data.meta.current_page} of {data.meta.last_page}
          </span>
          <Button
            variant="outline"
            disabled={filters.page === data.meta.last_page}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
