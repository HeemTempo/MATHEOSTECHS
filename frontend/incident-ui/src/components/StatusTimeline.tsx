import { CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/helpers';
import { INCIDENT_STATUS_LABELS } from '../utils/constants';
import type { IncidentUpdate } from '../api/incidents';

interface StatusTimelineProps {
  updates: IncidentUpdate[];
  currentStatus: string;
}

export function StatusTimeline({ updates, currentStatus }: StatusTimelineProps) {
  // Add current status as the first item if no updates
  const timelineItems = updates.length > 0 ? updates : [];

  return (
    <div className="space-y-4">
      {timelineItems.map((update, index) => (
        <div key={update.id} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            {index < timelineItems.length - 1 && (
              <div className="w-0.5 h-full bg-[#2e3149] mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">
                {INCIDENT_STATUS_LABELS[update.old_status as keyof typeof INCIDENT_STATUS_LABELS]} 
                {' → '}
                {INCIDENT_STATUS_LABELS[update.new_status as keyof typeof INCIDENT_STATUS_LABELS]}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Updated by {update.updater.name}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {formatRelativeTime(update.created_at)}
            </p>
          </div>
        </div>
      ))}

      {timelineItems.length === 0 && (
        <div className="text-center py-4 text-slate-400">
          No status updates yet
        </div>
      )}
    </div>
  );
}
