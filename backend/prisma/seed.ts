import { PrismaClient } from '@prisma/client';
import { toDecimal } from '../src/models/expense';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.idempotencyKey.deleteMany();

  // Seed sample expenses
  const expenses = [
    {
      amount: toDecimal(45.99),
      category: 'Food',
      description: 'Lunch at cafe',
      date: new Date('2024-01-15'),
    },
    {
      amount: toDecimal(29.99),
      category: 'Transport',
      description: 'Monthly bus pass',
      date: new Date('2024-01-14'),
    },
    {
      amount: toDecimal(120.50),
      category: 'Shopping',
      description: 'New clothes',
      date: new Date('2024-01-13'),
    },
    {
      amount: toDecimal(15.75),
      category: 'Entertainment',
      description: 'Movie ticket',
      date: new Date('2024-01-12'),
    },
    {
      amount: toDecimal(89.99),
      category: 'Utilities',
      description: 'Internet bill',
      date: new Date('2024-01-11'),
    },
    {
      amount: toDecimal(25.00),
      category: 'Food',
      description: 'Groceries',
      date: new Date('2024-01-10'),
    },
    {
      amount: toDecimal(60.00),
      category: 'Health',
      description: 'Gym membership',
      date: new Date('2024-01-09'),
    },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({
      data: expense,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(' Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });