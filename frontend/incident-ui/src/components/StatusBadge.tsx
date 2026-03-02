import { Badge } from './ui/badge';
import { INCIDENT_STATUS_LABELS, INCIDENT_STATUS_COLORS } from '../utils/constants';

interface StatusBadgeProps {
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${INCIDENT_STATUS_COLORS[status]} ${className}`}
    >
      {INCIDENT_STATUS_LABELS[status]}
    </Badge>
  );
}
