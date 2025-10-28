# Finance Backend

1. Copy `.env.example` to `.env` and fill values (MONGO_URI, JWT_SECRET)
2. Install:
   npm install
3. Run dev:
   npm run dev
4. API:
   POST /api/auth/signup  {name, email, password}
   POST /api/auth/login   {email, password}
   GET /api/transactions  (Auth header: x-auth-token: <token>)
   POST /api/transactions {title, amount, type: income|expense, category?, date?, notes?}
   PUT /api/transactions/:id
   DELETE /api/transactions/:id
