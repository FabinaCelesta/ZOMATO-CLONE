# AI-Powered Zomato Clone (MERN)

A full-stack food discovery and ordering project built for a final-year portfolio.

## Features
- User registration/login with JWT
- Restaurant browsing, search and filters
- Restaurant details and menu
- Cart and quantity management
- Order placement and order history
- Restaurant ratings and reviews
- Admin restaurant/menu/order management
- AI food recommendation module (rule-based starter, easy to upgrade to an LLM)

## Run
### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a MongoDB Atlas/local connection and put it in `backend/.env`.
