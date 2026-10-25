import React from 'react';

const CATEGORY_STYLES = {
  // Income
  SALARY: { label: 'Salary', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  BUSINESS: { label: 'Business', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  INVESTMENTS: { label: 'Investments', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  FREELANCE: { label: 'Freelance', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  RENTAL: { label: 'Rental', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  DIVIDENDS: { label: 'Dividends', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  OTHER_INCOME: { label: 'Other Income', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },

  // Expenses
  HOUSING: { label: 'Housing', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  UTILITIES: { label: 'Utilities', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  FOOD_DINING: { label: 'Food & Dining', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  GROCERIES: { label: 'Groceries', bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  TRANSPORTATION: { label: 'Transportation', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  HEALTHCARE: { label: 'Healthcare', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  ENTERTAINMENT: { label: 'Entertainment', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  SHOPPING: { label: 'Shopping', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  EDUCATION: { label: 'Education', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  PERSONAL_CARE: { label: 'Personal Care', bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  DEBT_PAYMENT: { label: 'Debt Payment', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  TRAVEL: { label: 'Travel', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  SUBSCRIPTIONS: { label: 'Subscriptions', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  INSURANCE: { label: 'Insurance', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  SAVINGS: { label: 'Savings', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  MISCELLANEOUS: { label: 'Miscellaneous', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export const formatCategoryLabel = (category) => {
  return CATEGORY_STYLES[category]?.label || (category ? category.replace(/_/g, ' ') : 'General');
};

export default function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || {
    label: category ? category.replace(/_/g, ' ') : 'Other',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  );
}

