import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function StatusBadge({ status, isOverdue }) {
  if (status === 'PAID') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Paid
      </span>
    );
  }

  if (status === 'OVERDUE' || isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" />
        Overdue
      </span>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <XCircle className="w-3.5 h-3.5" />
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

