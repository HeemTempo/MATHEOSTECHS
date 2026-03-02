import { Badge } from './ui/badge';
import { INCIDENT_SEVERITY_LABELS, INCIDENT_SEVERITY_COLORS } from '../utils/constants';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${INCIDENT_SEVERITY_COLORS[severity]} ${className}`}
    >
      {INCIDENT_SEVERITY_LABELS[severity]}
    </Badge>
  );
}
