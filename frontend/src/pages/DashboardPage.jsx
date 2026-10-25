import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Plus, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import StatCard from '../components/StatCard';
import CategoryBadge, { formatCategoryLabel } from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ onNavigate, onOpenAction }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getSummary({ month: selectedMonth, year: selectedYear });
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedMonth, selectedYear]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  const {
    netBalance = 0,
    currentMonthIncome = 0,
    currentMonthExpenses = 0,
    currentMonthSavings = 0,
    currentMonthSavingsRate = 0,
    totalBudget = 0,
    totalBudgetSpent = 0,
    totalBudgetRemaining = 0,
    budgetUsagePercentage = 0,
    overdueBillsCount = 0,
    pendingBillsCount = 0,
    pendingBillsAmount = 0,
    recentIncomes = [],
    recentExpenses = [],
    upcomingBills = [],
    categoryExpenses = [],
    monthlyTrends = [],
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions & Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium">Real-time overview of your cash flow, bills, and monthly budgets</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Action Buttons */}
          <button
            onClick={() => onOpenAction('add-income')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Income
          </button>
          <button
            onClick={() => onOpenAction('add-expense')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expense
          </button>
          <button
            onClick={() => onOpenAction('add-bill')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bill
          </button>
        </div>
      </div>

      {/* Overdue / Due Soon Bills Alert Banner */}
      {(overdueBillsCount > 0 || pendingBillsCount > 0) && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          overdueBillsCount > 0 
            ? 'bg-rose-50/70 border-rose-200 text-rose-800' 
            : 'bg-amber-50/70 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${overdueBillsCount > 0 ? 'bg-rose-100' : 'bg-amber-100'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {overdueBillsCount > 0 
                  ? `Attention: You have ${overdueBillsCount} overdue bill${overdueBillsCount > 1 ? 's' : ''}!`
                  : `Reminder: You have ${pendingBillsCount} pending bill${pendingBillsCount > 1 ? 's' : ''} this month.`}
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                Total unpaid bills amount: <strong className="font-semibold">${Number(pendingBillsAmount || 0).toFixed(2)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('bills')}
            className="inline-flex items-center gap-1 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            View Bills
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Balance"
          amount={netBalance}
          subtitle="Cumulative lifetime savings"
          icon={Wallet}
          color={netBalance >= 0 ? 'brand' : 'rose'}
        />
        <StatCard
          title="Monthly Income"
          amount={currentMonthIncome}
          subtitle={`Earnings for current month`}
          icon={TrendingUp}
          color="brand"
        />
        <StatCard
          title="Monthly Expenses"
          amount={currentMonthExpenses}
          subtitle={`Spent across all categories`}
          icon={TrendingDown}
          color="rose"
        />
        <StatCard
          title="Monthly Savings"
          amount={currentMonthSavings}
          subtitle={`Savings rate: ${currentMonthSavingsRate.toFixed(1)}%`}
          icon={PiggyBank}
          color={currentMonthSavings >= 0 ? 'blue' : 'rose'}
          trend={`${currentMonthSavingsRate.toFixed(1)}% saved`}
        />
      </div>

      {/* Budget & Monthly Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Budget Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Monthly Budget Status</h3>
              <button
                onClick={() => onNavigate('budgets')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Manage
              </button>
            </div>

            {totalBudget > 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs font-semibold text-slate-500">Budget Spent</span>
                    <span className="text-sm font-bold text-slate-900">
                      ${Number(totalBudgetSpent).toFixed(2)} / ${Number(totalBudget).toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        budgetUsagePercentage > 100
                          ? 'bg-rose-500'
                          : budgetUsagePercentage > 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Remaining</p>
                    <p className={`text-base font-bold mt-0.5 ${
                      totalBudgetRemaining < 0 ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      ${Number(totalBudgetRemaining).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Used</p>
                    <p className={`text-base font-bold mt-0.5 ${
                      budgetUsagePercentage > 100 ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {budgetUsagePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {budgetUsagePercentage > 100 && (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    You have exceeded your total monthly budget by ${(totalBudgetSpent - totalBudget).toFixed(2)}!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-3">No monthly budget defined for this month.</p>
                <button
                  onClick={() => onOpenAction('set-budget')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                >
                  Set Monthly Budget
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Keep your spending below 80% to maintain healthy savings</span>
          </div>
        </div>

        {/* 6-Month Income vs Expense Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cash Flow Trends</h3>
              <p className="text-xs text-slate-500">Income vs Expenses over the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expenses
              </span>
            </div>
          </div>

          {monthlyTrends && monthlyTrends.length > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-6 gap-2 items-end h-44 pb-2">
                {(() => {
                  const maxVal = Math.max(
                    ...monthlyTrends.map(m => Math.max(Number(m.income || 0), Number(m.expense || 0))),
                    100
                  );

                  return monthlyTrends.map((item, idx) => {
                    const incHeight = Math.max((Number(item.income || 0) / maxVal) * 100, 4);
                    const expHeight = Math.max((Number(item.expense || 0) / maxVal) * 100, 4);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full flex items-end justify-center gap-1 h-36">
                          {/* Income bar */}
                          <div
                            title={`Income: $${Number(item.income || 0).toFixed(2)}`}
                            className="w-1/2 max-w-[18px] bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all cursor-pointer"
                            style={{ height: `${incHeight}%` }}
                          />
                          {/* Expense bar */}
                          <div
                            title={`Expense: $${Number(item.expense || 0).toFixed(2)}`}
                            className="w-1/2 max-w-[18px] bg-rose-500 rounded-t-md hover:bg-rose-600 transition-all cursor-pointer"
                            style={{ height: `${expHeight}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">
                          {item.monthName.split(' ')[0]}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">No historical trend data available yet</div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Net savings: ${Number(currentMonthSavings).toFixed(2)}</span>
            <span>Savings rate: {currentMonthSavingsRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Category Expenses & Upcoming Bills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Expenses by Category</h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          {categoryExpenses && categoryExpenses.length > 0 ? (
            <div className="space-y-3.5">
              {categoryExpenses.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{formatCategoryLabel(cat.category)}</span>
                    <span className="text-slate-900">
                      ${Number(cat.amount).toFixed(2)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No expenses recorded for this month yet.
            </div>
          )}
        </div>

        {/* Upcoming Bills List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Upcoming & Pending Bills</h3>
            <button
              onClick={() => onNavigate('bills')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Manage Bills
            </button>
          </div>

          {upcomingBills && upcomingBills.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{bill.title}</p>
                      <StatusBadge status={bill.status} isOverdue={bill.overdue} />
                    </div>
                    <p className="text-xs text-slate-500">
                      Due: {bill.dueDate} {bill.daysRemaining >= 0 ? `(in ${bill.daysRemaining} days)` : `(${Math.abs(bill.daysRemaining)} days overdue)`}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    ${Number(bill.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No pending bills! You're all caught up.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

