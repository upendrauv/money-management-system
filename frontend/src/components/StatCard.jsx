import React from 'react';

export default function StatCard({ title, amount, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-800'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-100 text-blue-800'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-800'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      badge: 'bg-purple-100 text-purple-800'
    }
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {typeof amount === 'number' 
            ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : amount}
        </h3>

        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scheme.badge}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}

