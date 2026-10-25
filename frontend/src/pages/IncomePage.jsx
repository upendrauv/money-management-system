import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  Calendar,
  DollarSign, 
  Filter,
  Check
} from 'lucide-react';
import { incomeApi } from '../api/incomeApi';
import CategoryBadge, { formatCategoryLabel } from '../components/CategoryBadge';
import Modal from '../components/Modal';

const INCOME_CATEGORIES = [
  'SALARY',
  'BUSINESS',
  'INVESTMENTS',
  'FREELANCE',
  'RENTAL',
  'DIVIDENDS',
  'OTHER_INCOME'
];

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'SALARY',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const res = await incomeApi.getAll({ month: selectedMonth, year: selectedYear });
      if (res.data) {
        setIncomes(res.data);
      }
    } catch (err) {
      console.error('Failed to load incomes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [selectedMonth, selectedYear]);

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setFormData({
      title: '',
      amount: '',
      category: 'SALARY',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      title: income.title,
      amount: income.amount,
      category: income.category,
      date: income.date,
      notes: income.notes || ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await incomeApi.delete(id);
        fetchIncomes();
      } catch (err) {
        alert(err?.message || 'Failed to delete income');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes
      };

      if (editingIncome) {
        await incomeApi.update(editingIncome.id, payload);
      } else {
        await incomeApi.create(payload);
      }

      setIsModalOpen(false);
      fetchIncomes();
    } catch (err) {
      setError(err?.message || 'Failed to save income');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncomes = incomes.filter(inc => 
    inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inc.notes && inc.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalFilteredIncome = filteredIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Income Tracker</h2>
          <p className="text-xs text-slate-500 font-medium">Record, categorize, and monitor all your income streams</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Income
        </button>
      </div>

      {/* Filter Bar & Summary */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search income entries..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Total Income pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-semibold">Total Income:</span>
          <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
            ${totalFilteredIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading incomes...</div>
        ) : filteredIncomes.length === 0 ? (
          <div className="text-center py-14 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No income entries found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your salary, freelance gigs, or other income to start tracking cash flow for this period.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
            >
              Add First Income
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Source / Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredIncomes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-500 whitespace-nowrap">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{item.title}</td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{item.notes || '—'}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-right whitespace-nowrap">
                      +${Number(item.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncome ? 'Edit Income Entry' : 'Add New Income'}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Source / Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Salary, Freelance project"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              rows="3"
              placeholder="Any additional details or memos..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
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
              {submitting ? 'Saving...' : editingIncome ? 'Update Income' : 'Save Income'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

