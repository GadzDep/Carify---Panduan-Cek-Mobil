import { InspectionResult, STATUS_LABELS } from '@/types/inspection';

export function getStatusLabel(status: InspectionResult['status']) {
  return STATUS_LABELS[status] || STATUS_LABELS.not_recommended;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 85) return '#22C55E';
  if (percentage >= 70) return '#EAB308';
  if (percentage >= 50) return '#F97316';
  return '#EF4444';
}

export function getScoreEmoji(percentage: number): string {
  if (percentage >= 85) return '🟢';
  if (percentage >= 70) return '🟡';
  if (percentage >= 50) return '🟠';
  return '🔴';
}

export function generateWatermarkText(plateNumber: string): string {
  const now = new Date();
  const timestamp = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID');
  return `Inspected by Carify\n${plateNumber}\n${timestamp}`;
}
