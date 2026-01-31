# Expense Tracker

A production-ready personal finance tool for tracking expenses with robust error handling and real-world usage considerations.

## Features

### Core Features
- ✅ Create expense entries with amount, category, description, and date
- ✅ View list of expenses with filtering by category
- ✅ Sort expenses by date (newest/oldest first)
- ✅ Display total amount for current filtered list
- ✅ Idempotent POST requests to prevent duplicate entries on retries
- ✅ Proper money handling using Decimal types

### Nice-to-Have Features
- ✅ Basic validation (positive amounts, required fields)
- ✅ Summary view with category breakdown and charts
- ✅ Error and loading states in UI
- ✅ Responsive design
- ✅ Docker support for easy deployment

## Tech Stack

### Backend
- **Node.js** with **TypeScript** for type safety
- **Express.js** web framework
- **PostgreSQL** with **Prisma ORM** for data persistence
- **Zod** for runtime validation
- **Helmet** & **CORS** for security

### Frontend
- **React** with **TypeScript**
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Hook Form** with **Zod** validation
- **date-fns** for date manipulation
- **recharts** for data visualization

## Design Decisions & Trade-offs

### 1. Database Choice: PostgreSQL
- **Why**: ACID compliance, Decimal support, production-ready
- **Trade-off**: More resource-heavy than SQLite, but better for real-world conditions
- **Alternative considered**: SQLite (simpler) but lacks proper Decimal support

### 2. Money Handling: Decimal in Database
- **Why**: Avoid floating-point errors for financial calculations
- **Implementation**: Store amounts as DECIMAL(10,2) in database
- **Trade-off**: Slightly more complex than storing as integers

### 3. Idempotency Implementation
- **Why**: Prevent duplicate entries on retries (network issues, browser refresh)
- **Implementation**: Idempotency keys stored in separate table with 24h TTL
- **Trade-off**: Extra database table but ensures data correctness

### 4. Validation Strategy
- **Why**: Both client-side (UX) and server-side (security) validation
- **Implementation**: Zod schemas shared between frontend and backend
- **Trade-off**: Some code duplication but better separation of concerns

### 5. Error Handling
- **Why**: Graceful degradation in real-world conditions
- **Implementation**: Comprehensive error middleware with user-friendly messages
- **Trade-off**: More code but better user experience

## What Wasn't Implemented (Due to Time)

1. **User Authentication**: Focused on single-user experience
2. **Export Functionality**: CSV/PDF export of expenses
3. **Advanced Analytics**: Trends over time, budget tracking
4. **Mobile App**: PWA capabilities not implemented
5. **End-to-End Tests**: Only basic unit tests included
6. **Caching Layer**: Redis for performance optimization

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Without Docker
```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure your database
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev