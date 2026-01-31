import { Router } from 'express';
import { prisma } from '../db';
import { ExpenseSchema, type ExpenseInput, toDecimal } from '../models/expense';
import { Prisma } from '@prisma/client';

const router = Router();

// Create expense with idempotency
router.post('/', async (req, res, next) => {
  try {
    // Validate input
    const validatedData = ExpenseSchema.parse(req.body);
    
    // Check for idempotency key
    const idempotencyKey = validatedData.idempotencyKey;
    if (idempotencyKey) {
      const existing = await prisma.idempotencyKey.findUnique({
        where: { key: idempotencyKey },
      });
      
      if (existing) {
        // Return cached response
        return res.status(200).json(existing.response);
      }
    }
    
    // Create expense
    const expense = await prisma.expense.create({
      data: {
        amount: toDecimal(validatedData.amount),
        category: validatedData.category,
        description: validatedData.description,
        date: new Date(validatedData.date),
      },
    });
    
    // Store idempotency key if provided
    if (idempotencyKey) {
      await prisma.idempotencyKey.create({
        data: {
          key: idempotencyKey,
          response: expense,
        },
      });
    }
    
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

// Get expenses with filtering and sorting
router.get('/', async (req, res, next) => {
  try {
    const { category, sort = 'date_desc' } = req.query;
    
    // Build where clause
    const where: Prisma.ExpenseWhereInput = {};
    if (category && category !== 'all') {
      where.category = category as string;
    }
    
    // Build order by
    const orderBy: Prisma.ExpenseOrderByWithRelationInput[] = [];
    if (sort === 'date_desc') {
      orderBy.push({ date: 'desc' });
    } else {
      orderBy.push({ date: 'asc' });
    }
    
    // Get expenses
    const expenses = await prisma.expense.findMany({
      where,
      orderBy,
    });
    
    // Calculate total
    const total = expenses.reduce((sum, expense) => {
      return sum + expense.amount.toNumber();
    }, 0);
    
    res.json({
      expenses,
      total,
      count: expenses.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get unique categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.expense.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    
    res.json(categories.map(c => c.category));
  } catch (error) {
    next(error);
  }
});

export default router;