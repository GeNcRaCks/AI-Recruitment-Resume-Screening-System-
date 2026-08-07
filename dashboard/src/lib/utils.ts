// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — Utility Functions
// ═══════════════════════════════════════════════════════════════

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getScoreColor(score: number): string {
  if (score >= 0.7) return 'var(--color-success)';
  if (score >= 0.4) return 'var(--color-warning)';
  return 'var(--color-error)';
}

export function getScoreLabel(score: number): string {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.7) return 'Strong';
  if (score >= 0.5) return 'Moderate';
  if (score >= 0.3) return 'Weak';
  return 'Poor';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New': '#6366f1',
    'Screening': '#f59e0b',
    'Interview': '#8b5cf6',
    'Offered': '#06b6d4',
    'Hired': '#10b981',
    'Rejected': '#ef4444',
    'Active': '#10b981',
    'Closed': '#6b7280',
    'Draft': '#f59e0b',
  };
  return colors[status] || '#6b7280';
}

export function getRecommendationColor(rec: string): string {
  const colors: Record<string, string> = {
    'Interview': '#10b981',
    'Hold': '#f59e0b',
    'Reject': '#ef4444',
  };
  return colors[rec] || '#6b7280';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
