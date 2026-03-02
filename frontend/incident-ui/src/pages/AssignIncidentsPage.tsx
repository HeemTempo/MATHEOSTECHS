import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { SeverityBadge } from '../components/SeverityBadge';
import { incidentsApi } from '../api/incidents';
import { usersApi } from '../api/users';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function AssignIncidentsPage() {
  const queryClient = useQueryClient();
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'unassigned' | 'assigned'>('unassigned');

  // Fetch incidents based on tab
  const { data: incidentsData, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents', 'assign', activeTab],
    queryFn: () => incidentsApi.getAll({ per_page: 100 }),
  });

  // Fetch operators
  const { data: operatorsData, isLoading: operatorsLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: usersApi.getOperators,
  });

  const allIncidents = incidentsData?.data || [];
  
  // Filter incidents based on tab
  const incidents = activeTab === 'unassigned' 
    ? allIncidents.filter(i => !i.assigned_user && i.status !== 'closed') // Unassigned: only non-closed
    : allIncidents.filter(i => i.assigned_user); // Assigned: ALL assigned incidents (including closed)
  
  const operators = operatorsData?.data || [];

  // Assign mutation
  const assignMutation = useMutation({
    mutationFn: ({ incidentId, operatorId }: { incidentId: number; operatorId: number }) =>
      incidentsApi.assign(incidentId, operatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      setSelectedIncident(null);
      setSelectedOperator(null);
    },
  });

  const handleAssign = () => {
    if (selectedIncident && selectedOperator) {
      assignMutation.mutate({
        incidentId: selectedIncident,
        operatorId: selectedOperator,
      });
    }
  };

  if (incidentsLoading || operatorsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Assign Incidents"
        description="Assign unassigned incidents to operators"
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-[#2e3149]">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveTab('unassigned');
              setSelectedIncident(null);
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'unassigned'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unassigned ({allIncidents.filter(i => !i.assigned_user && i.status !== 'closed').length})
          </button>
          <button
            onClick={() => {
              setActiveTab('assigned');
              setSelectedIncident(null);
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'assigned'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Assigned ({allIncidents.filter(i => i.assigned_user).length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents List */}
        <Card className="bg-[#1a1d27] border-[#2e3149]">
          <CardHeader>
            <CardTitle className="text-white">
              {activeTab === 'unassigned' ? 'Unassigned Incidents' : 'Assigned Incidents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedIncident === incident.id
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-[#0f1117] border-[#2e3149] hover:border-[#3e4169]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{incident.title}</h3>
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                    {incident.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={incident.status} />
                    <span className="text-xs text-slate-500">
                      {incident.assigned_user ? (
                        <span className="text-green-400">
                          Assigned to: {incident.assigned_user.name}
                        </span>
                      ) : (
                        <span className="text-amber-400">Unassigned</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  {activeTab === 'unassigned' 
                    ? 'No unassigned incidents' 
                    : 'No assigned incidents'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operators List */}
        <Card className="bg-[#1a1d27] border-[#2e3149]">
          <CardHeader>
            <CardTitle className="text-white">Operators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {operators.map((operator) => (
                <div
                  key={operator.id}
                  onClick={() => setSelectedOperator(operator.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedOperator === operator.id
                      ? 'bg-green-500/10 border-green-500/50'
                      : 'bg-[#0f1117] border-[#2e3149] hover:border-[#3e4169]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{operator.name}</h3>
                      <p className="text-slate-400 text-sm">{operator.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <span className="text-indigo-400 font-medium">
                        {operator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {operators.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No operators found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Button */}
      <div className="mt-6 flex justify-center">
        <Card className="bg-[#1a1d27] border-[#2e3149] w-full max-w-md">
          <CardContent className="pt-6">
            {selectedIncident && selectedOperator ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-slate-400 mb-2">You are about to assign:</p>
                  <p className="text-white font-medium">
                    Incident #{selectedIncident}
                  </p>
                  <p className="text-slate-400 my-2">to</p>
                  <p className="text-white font-medium">
                    {operators.find((o) => o.id === selectedOperator)?.name}
                  </p>
                </div>
                <Button
                  onClick={handleAssign}
                  disabled={assignMutation.isPending || activeTab === 'assigned'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  size="lg"
                >
                  {assignMutation.isPending ? 'Assigning...' : 
                   activeTab === 'assigned' ? 'Already Assigned' : 'Assign Incident'}
                </Button>
                {assignMutation.isSuccess && (
                  <div className="text-center text-green-400 text-sm">
                    ✓ Incident assigned successfully!
                  </div>
                )}
                {assignMutation.isError && (
                  <div className="text-center text-red-400 text-sm">
                    ✗ Could not assign incident. Please try again.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-4">
                Select an incident and an operator to assign
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
