import { Badge } from './ui/badge';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '../utils/constants';

interface RoleBadgeProps {
  role: 'reporter' | 'operator' | 'admin';
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${USER_ROLE_COLORS[role]} ${className}`}
    >
      {USER_ROLE_LABELS[role]}
    </Badge>
  );
}
