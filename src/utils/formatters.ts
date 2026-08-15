/**
 * SOURCE DETECTIVE - Utility Helpers
 */

export function formatThaiDate(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function getDetectiveRankTitle(percentage: number): { title: string; color: string; badge: string } {
  if (percentage >= 85) {
    return { title: 'ยอดนักสืบระดับตำนาน (Master Detective)', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  } else if (percentage >= 70) {
    return { title: 'นักสืบอาวุโส (Senior Detective)', color: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
  } else if (percentage >= 50) {
    return { title: 'นักสืบฝึกหัด (Junior Detective)', color: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  } else {
    return { title: 'ผู้ช่วยนักสืบ (Detective Trainee)', color: 'text-slate-400', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
  }
}
