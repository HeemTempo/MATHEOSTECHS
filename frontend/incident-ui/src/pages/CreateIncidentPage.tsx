import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PageHeader } from '../components/PageHeader';
import { incidentsApi } from '../api/incidents';
import { INCIDENT_SEVERITY } from '../utils/constants';

export function CreateIncidentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  const createMutation = useMutation({
    mutationFn: incidentsApi.create,
    onSuccess: () => {
      toast.success('Incident created successfully!', {
        description: 'Your incident has been reported and is now being tracked.'
      });
      navigate(`/incidents/`);
    },
    onError: (error: any) => {
      toast.error('Failed to create incident', {
        description: error?.response?.data?.message || 'Please try again later.'
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div>
      <PageHeader title="Create Incident" description="Report a new incident" />

      <Card className="max-w-2xl bg-[#1a1d27] border-[#2e3149]">
        <CardHeader>
          <CardTitle className="text-white">Incident Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="bg-[#0f1117] border-[#2e3149] text-white"
                placeholder="Brief description of the incident"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={6}
                className="bg-[#0f1117] border-[#2e3149] text-white"
                placeholder="Detailed description of what happened..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity" className="text-slate-300">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(v: any) => setFormData(prev => ({ ...prev, severity: v }))}
              >
                <SelectTrigger className="bg-[#0f1117] border-[#2e3149] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(INCIDENT_SEVERITY).map(severity => (
                    <SelectItem key={severity} value={severity}>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Incident'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/incidents')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
