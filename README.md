# Finance Tracker API

A RESTful API for managing finances built with Express.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start MongoDB service

4. Run the application:
```bash
npm run dev  # Development with nodemon
npm start    # Production
npm test     # Test all API endpoints
```

## API Endpoints

###  Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

###  User Management
- `GET /api/user/profile` - Get user profile (🔒 Auth required)
- `PATCH /api/user/preferences` - Update user preferences (🔒 Auth required)

###  Dashboard
- `GET /api/summary` - Get account summary (🔒 Auth required)
  - Query params: `month`, `year`

###  Transactions
- `GET /api/transactions` - Get transactions with filtering & pagination (🔒 Auth required)
  - Query params: `startDate`, `endDate`, `category`, `description`, `page`, `limit`
- `POST /api/transactions` - Add new transaction (🔒 Auth required)
- `PUT /api/transactions/:id` - Update transaction (🔒 Auth required)
- `DELETE /api/transactions/:id` - Delete transaction (🔒 Auth required)
- `GET /api/transactions/export/csv` - Export transactions as CSV (🔒 Auth required)

###  Analytics
- `GET /api/analytics/category-summary` - Get category totals for charts (🔒 Auth required)
  - Query params: `month`, `year`

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- XSS and NoSQL injection prevention

## Database Schema

### Users
- username, email, passwordHash, darkMode, timestamps

### Transactions
- userId, date, description, amount, category, type, timestamps