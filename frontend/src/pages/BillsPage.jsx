import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  RotateCcw,
  Calendar,
  DollarSign
} from 'lucide-react';
import { billApi } from '../api/billApi';
import CategoryBadge, { formatCategoryLabel } from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const BILL_CATEGORIES = [
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
  'SUBSCRIPTIONS',
  'INSURANCE',
  'MISCELLANEOUS'
];

const BILL_FREQUENCIES = [
  { value: 'ONE_TIME', label: 'One-time' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' }
];

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, OVERDUE, PAID

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'UTILITIES',
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'MONTHLY',
    isRecurring: true,
    reminderDaysBefore: 3,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await billApi.getAll();
      if (res.data) {
        setBills(res.data);
      }
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleOpenAdd = () => {
    setEditingBill(null);
    setFormData({
      title: '',
      amount: '',
      category: 'UTILITIES',
      dueDate: new Date().toISOString().split('T')[0],
      frequency: 'MONTHLY',
      isRecurring: true,
      reminderDaysBefore: 3,
      notes: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      title: bill.title,
      amount: bill.amount,
      category: bill.category,
      dueDate: bill.dueDate,
      frequency: bill.frequency,
      isRecurring: bill.isRecurring,
      reminderDaysBefore: bill.reminderDaysBefore || 3,
      notes: bill.notes || ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await billApi.markAsPaid(id);
      fetchBills();
    } catch (err) {
      alert(err?.message || 'Failed to mark bill as paid');
    }
  };

  const handleMarkAsPending = async (id) => {
    try {
      await billApi.markAsPending(id);
      fetchBills();
    } catch (err) {
      alert(err?.message || 'Failed to update bill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billApi.delete(id);
        fetchBills();
      } catch (err) {
        alert(err?.message || 'Failed to delete bill');
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
        dueDate: formData.dueDate,
        frequency: formData.frequency,
        isRecurring: formData.isRecurring,
        reminderDaysBefore: parseInt(formData.reminderDaysBefore, 10),
        notes: formData.notes
      };

      if (editingBill) {
        await billApi.update(editingBill.id, payload);
      } else {
        await billApi.create(payload);
      }

      setIsModalOpen(false);
      fetchBills();
    } catch (err) {
      setError(err?.message || 'Failed to save bill');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter bills by tab
  const filteredBills = bills.filter(b => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PAID') return b.status === 'PAID';
    if (activeTab === 'OVERDUE') return b.status === 'OVERDUE' || b.overdue;
    if (activeTab === 'PENDING') return b.status === 'PENDING' && !b.overdue;
    return true;
  });

  const overdueCount = bills.filter(b => b.status === 'OVERDUE' || b.overdue).length;
  const pendingCount = bills.filter(b => b.status === 'PENDING' && !b.overdue).length;
  const paidCount = bills.filter(b => b.status === 'PAID').length;

  const totalUnpaidAmount = bills
    .filter(b => b.status !== 'PAID')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bills & Subscriptions</h2>
          <p className="text-xs text-slate-500 font-medium">Never miss a payment deadline. Track electricity, rent, internet and memberships.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </button>
      </div>

      {/* Tabs and Summary Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Bills ({bills.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('OVERDUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'OVERDUE'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setActiveTab('PAID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'PAID'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Paid ({paidCount})
          </button>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-semibold">Total Unpaid:</span>
          <span className="text-base font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
            ${totalUnpaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Bills Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-sm border border-slate-200/80">
          Loading bills...
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No bills found in this section</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Set up reminders for your rent, utility bills, gym membership, or streaming services.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Add Your First Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBills.map((bill) => {
            const isPaid = bill.status === 'PAID';
            const isOverdue = bill.status === 'OVERDUE' || bill.overdue;

            return (
              <div
                key={bill.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  isOverdue ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">{bill.title}</h4>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <CategoryBadge category={bill.category} />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          {bill.frequency?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={bill.status} isOverdue={bill.overdue} />
                  </div>

                  <div className="my-3 py-3 border-y border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Amount</span>
                      <span className="text-2xl font-black text-slate-900">
                        ${Number(bill.amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-400 block">Due Date</span>
                      <span className={`text-xs font-bold ${
                        isOverdue ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {bill.dueDate}
                      </span>
                    </div>
                  </div>

                  {bill.notes && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg">
                      {bill.notes}
                    </p>
                  )}

                  {!isPaid && (
                    <div className="text-[11px] font-medium text-slate-500 mb-2">
                      {bill.daysRemaining < 0 ? (
                        <span className="text-rose-600 font-semibold">
                          Overdue by {Math.abs(bill.daysRemaining)} day{Math.abs(bill.daysRemaining) > 1 ? 's' : ''}
                        </span>
                      ) : bill.daysRemaining === 0 ? (
                        <span className="text-amber-600 font-bold">Due Today!</span>
                      ) : (
                        <span>Due in {bill.daysRemaining} days</span>
                      )}
                    </div>
                  )}

                  {isPaid && bill.paidDate && (
                    <div className="text-[11px] font-medium text-emerald-600 mb-2">
                      Paid on: {bill.paidDate}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(bill)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isPaid ? (
                    <button
                      onClick={() => handleMarkAsPending(bill.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Mark Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsPaid(bill.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBill ? 'Edit Bill Reminder' : 'Add New Bill Reminder'}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Bill Name / Service *</label>
            <input
              type="text"
              required
              placeholder="e.g. Electric Bill, Rent, Netflix Subscription"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              >
                {BILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              >
                {BILL_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4"
            />
            <label htmlFor="isRecurring" className="text-xs font-semibold text-slate-700">
              Recurring bill (auto repeats every cycle)
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Account # (Optional)</label>
            <textarea
              rows="3"
              placeholder="e.g. Account number, payment portal link, notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
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
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingBill ? 'Update Bill' : 'Save Bill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

