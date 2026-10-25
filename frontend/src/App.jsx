import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import BillsPage from './pages/BillsPage';
import BudgetPage from './pages/BudgetPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { billApi } from './api/billApi';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'incomes' | 'expenses' | 'bills' | 'budgets'
  const [pendingBillsCount, setPendingBillsCount] = useState(0);

  // Fetch pending bills count for sidebar badge
  const updatePendingCount = async () => {
    if (isAuthenticated) {
      try {
        const res = await billApi.getAll({ status: 'PENDING' });
        if (res.data) {
          setPendingBillsCount(res.data.length);
        }
      } catch (e) {
        // quiet fallback
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      updatePendingCount();
    }
  }, [isAuthenticated, currentTab]);

  const handleOpenAction = (action) => {
    if (action === 'add-income') {
      setCurrentTab('incomes');
    } else if (action === 'add-expense') {
      setCurrentTab('expenses');
    } else if (action === 'add-bill') {
      setCurrentTab('bills');
    } else if (action === 'set-budget') {
      setCurrentTab('budgets');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading SpendWise...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex">
      {/* Desktop Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        pendingBillsCount={pendingBillsCount} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          pendingBillsCount={pendingBillsCount} 
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage 
              onNavigate={(tab) => setCurrentTab(tab)} 
              onOpenAction={handleOpenAction} 
            />
          )}

          {currentTab === 'incomes' && <IncomePage />}
          {currentTab === 'expenses' && <ExpensePage />}
          {currentTab === 'bills' && <BillsPage />}
          {currentTab === 'budgets' && <BudgetPage />}
        </main>
      </div>
    </div>
  );
}

