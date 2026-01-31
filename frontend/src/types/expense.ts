export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotencyKey?: string;
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  count: number;
}

export interface Filters {
  category: string;
  sort: 'date_desc' | 'date_asc';
}