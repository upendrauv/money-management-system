import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PieChart, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  Calendar,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { budgetApi } from '../api/budgetApi';
import CategoryBadge, { formatCategoryLabel } from '../components/CategoryBadge';
import Modal from '../components/Modal';

const BUDGET_CATEGORIES = [
  'HOUSING',
  'UTILITIES',
  'FOOD_DINING',
  'GROCERIES',
  'TRANSPORTATION',
  'HEALTHCARE',
  'ENTERTAINMENT',
  'SHOPPING',
  'EDUCATION',
  'PERSONAL_CARE',
  'DEBT_PAYMENT',
  'TRAVEL',
  'SUBSCRIPTIONS',
  'INSURANCE',
  'SAVINGS',
  'MISCELLANEOUS'
];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: 'FOOD_DINING',
    allocatedAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getAll({ month: selectedMonth, year: selectedYear });
      if (res.data) {
        setBudgets(res.data);
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormData({
      category: 'FOOD_DINING',
      allocatedAmount: '',
      month: selectedMonth,
      year: selectedYear,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      allocatedAmount: budget.allocatedAmount,
      month: budget.month,
      year: budget.year,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this category budget?')) {
      try {
        await budgetApi.delete(id);
        fetchBudgets();
      } catch (err) {
        alert(err?.message || 'Failed to delete budget');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
      };

      await budgetApi.setBudget(payload);
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setError(err?.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations for total budget
  const totalAllocated = budgets.reduce((acc, curr) => acc + Number(curr.allocatedAmount || 0), 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + Number(curr.spentAmount || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Monthly Budget Planning</h2>
          <p className="text-xs text-slate-500 font-medium">Set spending ceilings by category and track your real-time budget burn rate</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Set Category Budget
        </button>
      </div>

      {/* Month Selector & Summary Row */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Period:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            {budgets.length} Categories Budgeted
          </div>
        </div>

        {/* Aggregate Budget Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Total Budget Allocated</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Total Spent</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500">
              {totalRemaining >= 0 ? 'Remaining Balance' : 'Over Budget Deficit'}
            </span>
            <p className={`text-2xl font-black mt-1 ${
              totalRemaining < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              ${Math.abs(totalRemaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Total Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>Overall Budget Burn</span>
            <span className={overallPercentage > 100 ? 'text-rose-600 font-bold' : ''}>
              {overallPercentage.toFixed(1)}% Used
            </span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-sm border border-slate-200/80">
          Loading budget plans...
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <PieChart className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No category budgets set for this month</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Set targets for groceries, dining out, utilities, or shopping to keep your spending disciplined.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
          >
            Create Your First Category Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const isExceeded = b.overBudget || b.percentageSpent > 100;
            const isWarning = b.percentageSpent >= 80 && !isExceeded;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  isExceeded ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <CategoryBadge category={b.category} />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                        title="Edit budget"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1 text-rose-400 hover:text-rose-600 rounded-lg"
                        title="Delete budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500">Allocated</span>
                      <span className="text-lg font-bold text-slate-900">
                        ${Number(b.allocatedAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-slate-500">Spent so far:</span>
                      <span className={`font-bold ${isExceeded ? 'text-rose-600' : 'text-slate-800'}`}>
                        ${Number(b.spentAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs font-semibold">
                      <span className="text-slate-500">
                        {isExceeded ? 'Exceeded by:' : 'Remaining:'}
                      </span>
                      <span className={isExceeded ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                        ${Math.abs(Number(b.remainingAmount)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className={isExceeded ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-500'}>
                        {b.percentageSpent.toFixed(1)}% used
                      </span>
                      {isExceeded ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Over Budget
                        </span>
                      ) : isWarning ? (
                        <span className="text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Near Limit
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> On Track
                        </span>
                      )}
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isExceeded
                            ? 'bg-rose-500'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(b.percentageSpent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? 'Edit Category Budget' : 'Set Category Budget'}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Expense Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Budget Limit ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="e.g. 500.00"
              value={formData.allocatedAmount}
              onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Month *</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

