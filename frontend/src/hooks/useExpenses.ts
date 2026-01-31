import { useState, useEffect, useCallback } from 'react';
import { expenseApi } from '../utils/api';
import type { Expense, ExpenseInput, Filters } from '../types/expense';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    sort: 'date_desc',
  });
  const [total, setTotal] = useState(0);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.sort) {
        params.sort = filters.sort;
      }
      
      const response = await expenseApi.getAll(params);
      setExpenses(response.data.expenses);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await expenseApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const addExpense = useCallback(async (data: ExpenseInput) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await expenseApi.create({
        ...data,
        idempotencyKey,
      });
      
      // Add to local state
      setExpenses(prev => [response.data, ...prev]);
      setTotal(prev => prev + data.amount);
      
      // Update categories if new
      if (!categories.includes(data.category)) {
        setCategories(prev => [...prev, data.category].sort());
      }
      
      return { success: true, data: response.data };
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Duplicate detected, refresh list
        fetchExpenses();
        return { success: true, message: 'Expense already recorded' };
      }
      throw err;
    }
  }, [categories, fetchExpenses]);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);

  return {
    expenses,
    loading,
    error,
    categories,
    filters,
    setFilters,
    total,
    addExpense,
    refresh: fetchExpenses,
  };
}