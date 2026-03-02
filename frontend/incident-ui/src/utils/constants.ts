// Status values matching backend
export const INCIDENT_STATUS = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const INCIDENT_STATUS_LABELS = {
  [INCIDENT_STATUS.OPEN]: 'Open',
  [INCIDENT_STATUS.INVESTIGATING]: 'Investigating',
  [INCIDENT_STATUS.RESOLVED]: 'Resolved',
  [INCIDENT_STATUS.CLOSED]: 'Closed',
};

export const INCIDENT_STATUS_COLORS = {
  [INCIDENT_STATUS.OPEN]: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  [INCIDENT_STATUS.INVESTIGATING]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [INCIDENT_STATUS.RESOLVED]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [INCIDENT_STATUS.CLOSED]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

// Severity values matching backend
export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const INCIDENT_SEVERITY_LABELS = {
  [INCIDENT_SEVERITY.LOW]: 'Low',
  [INCIDENT_SEVERITY.MEDIUM]: 'Medium',
  [INCIDENT_SEVERITY.HIGH]: 'High',
  [INCIDENT_SEVERITY.CRITICAL]: 'Critical',
};

export const INCIDENT_SEVERITY_COLORS = {
  [INCIDENT_SEVERITY.LOW]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  [INCIDENT_SEVERITY.MEDIUM]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [INCIDENT_SEVERITY.HIGH]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  [INCIDENT_SEVERITY.CRITICAL]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// User roles matching backend
export const USER_ROLES = {
  REPORTER: 'reporter',
  OPERATOR: 'operator',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.REPORTER]: 'Reporter',
  [USER_ROLES.OPERATOR]: 'Operator',
  [USER_ROLES.ADMIN]: 'Admin',
};

export const USER_ROLE_COLORS = {
  [USER_ROLES.REPORTER]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [USER_ROLES.OPERATOR]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [USER_ROLES.ADMIN]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// Status workflow - matching backend validation
export const STATUS_WORKFLOW = {
  [INCIDENT_STATUS.OPEN]: [INCIDENT_STATUS.INVESTIGATING],
  [INCIDENT_STATUS.INVESTIGATING]: [INCIDENT_STATUS.RESOLVED],
  [INCIDENT_STATUS.RESOLVED]: [INCIDENT_STATUS.CLOSED],
  [INCIDENT_STATUS.CLOSED]: [],
};
