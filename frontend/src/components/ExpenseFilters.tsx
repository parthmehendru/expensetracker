import React from 'react';
import { Filter, Calendar, ArrowUpDown } from 'lucide-react';
import type { Filters } from '../types/expense';

interface ExpenseFiltersProps {
  filters: Filters;
  categories: string[];
  onFilterChange: (filters: Filters) => void;
  total: number;
  count: number;
}

export function ExpenseFilters({ 
  filters, 
  categories, 
  onFilterChange, 
  total, 
  count 
}: ExpenseFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Sorting
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => 
                  onFilterChange({ ...filters, category: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Sort by Date
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => 
                    onFilterChange({ 
                      ...filters, 
                      sort: filters.sort === 'date_desc' ? 'date_asc' : 'date_desc' 
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {filters.sort === 'date_desc' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 min-w-[200px]">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">
              {total.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Total ({count} expense{count !== 1 ? 's' : ''})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}