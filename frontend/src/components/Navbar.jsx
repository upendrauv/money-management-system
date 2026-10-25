import React, { useState } from 'react';
import { 
  Wallet, 
  Menu, 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  PieChart, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentTab, setCurrentTab, pendingBillsCount = 0 }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Income', id: 'incomes', icon: TrendingUp },
    { name: 'Expenses', id: 'expenses', icon: TrendingDown },
    { name: 'Bills', id: 'bills', icon: Receipt, count: pendingBillsCount },
    { name: 'Budget', id: 'budgets', icon: PieChart },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 md:hidden">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-none">SpendWise</h1>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Money Manager</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Signed in as <strong className="text-slate-800">{user?.username}</strong>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 py-1.5 px-3 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

