import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { formatRelativeTime } from '../utils/helpers';
import type { Incident } from '../api/incidents';

interface IncidentTableProps {
  incidents: Incident[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  const navigate = useNavigate();

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No incidents found
      </div>
    );
  }

  return (
    <div className="border border-[#2e3149] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#2e3149] hover:bg-[#1a1d27]">
            <TableHead className="text-slate-400">Title</TableHead>
            <TableHead className="text-slate-400">Severity</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Reporter</TableHead>
            <TableHead className="text-slate-400">Assigned To</TableHead>
            <TableHead className="text-slate-400">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow
              key={incident.id}
              className="border-[#2e3149] hover:bg-[#1a1d27] cursor-pointer"
              onClick={() => navigate(`/incidents/${incident.id}`)}
            >
              <TableCell className="font-medium text-white">
                {incident.title}
              </TableCell>
              <TableCell>
                <SeverityBadge severity={incident.severity} />
              </TableCell>
              <TableCell>
                <StatusBadge status={incident.status} />
              </TableCell>
              <TableCell className="text-slate-300">
                {incident.reporter.name}
              </TableCell>
              <TableCell className="text-slate-300">
                {incident.assigned_user?.name || (
                  <span className="text-slate-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-slate-400">
                {formatRelativeTime(incident.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
