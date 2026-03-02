import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PageHeader } from '../components/PageHeader';
import { IncidentTable } from '../components/IncidentTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { incidentsApi } from '../api/incidents';
import { useAuthStore } from '../store/authStore';
import { INCIDENT_STATUS, USER_ROLES } from '../utils/constants';

export function DashboardPage() {
  const { user } = useAuthStore();
  const isOperator = user?.role === USER_ROLES.OPERATOR;

  const { data, isLoading } = useQuery({
    queryKey: ['incidents', 'dashboard', isOperator],
    queryFn: () => incidentsApi.getAll({ 
      per_page: 10, 
      sort_by: 'created_at', 
      sort_order: 'desc'
    }),
  });

  const incidents = data?.data || [];
  
  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === INCIDENT_STATUS.OPEN).length,
    investigating: incidents.filter(i => i.status === INCIDENT_STATUS.INVESTIGATING).length,
    resolved: incidents.filter(i => i.status === INCIDENT_STATUS.RESOLVED).length,
  };

  const statCards = [
    {
      title: isOperator ? 'Assigned to Me' : 'Total Incidents',
      value: stats.total,
      icon: AlertCircle,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
    {
      title: 'Open',
      value: stats.open,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Investigating',
      value: stats.investigating,
      icon: AlertCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={isOperator ? "Overview of your assigned incidents" : "Overview of incident management system"}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-[#1a1d27] border-[#2e3149]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Incidents */}
      <Card className="bg-[#1a1d27] border-[#2e3149]">
        <CardHeader>
          <CardTitle className="text-white">
            {isOperator ? 'My Assigned Incidents' : 'Recent Incidents'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <IncidentTable incidents={incidents} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
