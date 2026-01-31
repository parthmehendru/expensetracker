import React from 'react';
import { Wallet, RefreshCw } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { Summary } from './components/Summary';
import { useExpenses } from './hooks/useExpenses';

function App() {
  const {
    expenses,
    loading,
    error,
    categories,
    filters,
    setFilters,
    total,
    addExpense,
    refresh,
  } = useExpenses();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Expense Tracker
                </h1>
                <p className="text-gray-600">
                  Track and manage your personal expenses
                </p>
              </div>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ExpenseForm 
            onSubmit={addExpense} 
            categories={categories} 
          />
        </div>

        <div className="mb-8">
          <ExpenseFilters
            filters={filters}
            categories={categories}
            onFilterChange={setFilters}
            total={total}
            count={expenses.length}
          />
        </div>

        {/* Only show summary if we have expenses */}
        {expenses.length > 0 && (
          <div className="mb-8">
            <Summary expenses={expenses} />
          </div>
        )}

        <div className="mb-8">
          <ExpenseList 
            expenses={expenses} 
            loading={loading} 
            error={error} 
          />
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Expense Tracker v1.0 • Built with React & Express
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;