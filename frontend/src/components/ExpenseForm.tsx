import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { ExpenseInput } from '../types/expense';

const expenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .positive('Amount must be positive')
    .max(1000000000, 'Amount is too large'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description is too long'),
  date: z.string().min(1, 'Date is required'),
});

type FormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSubmit: (data: ExpenseInput) => Promise<any>;
  categories: string[];
}

export function ExpenseForm({ onSubmit, categories }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: undefined,
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      
      const result = await onSubmit({
        ...data,
        idempotencyKey: crypto.randomUUID(),
      });
      
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Expense added successfully!');
        reset();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 3000);
      }
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMessage(
        err.response?.data?.error || 
        err.message || 
        'Failed to add expense. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const amount = watch('amount');

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        Add New Expense
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className={`pl-8 block w-full rounded-md border ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
            {amount > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {amount.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                list="categories"
                {...register('category')}
                className={`flex-1 rounded-md border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Food, Transport, Entertainment"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className={`block w-full rounded-md border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="What was this expense for?"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date')}
              className={`block w-full rounded-md border ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{submitMessage}</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{submitMessage}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}