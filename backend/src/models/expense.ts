import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export const ExpenseSchema = z.object({
  amount: z
    .number()
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
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  idempotencyKey: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof ExpenseSchema>;

export interface Expense {
  id: string;
  amount: Decimal;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function toDecimal(value: number): Decimal {
  return new Decimal(value);
}

export function fromDecimal(decimal: Decimal): number {
  return decimal.toNumber();
}