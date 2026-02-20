# Money Guard Backend (Minimal)

Bu, Money Guard React projesini test etmek için hazırlanan **minimal** Node.js/Express backend'idir.

## Kurulum
```bash
npm i
cp .env.template .env
# .env içinde PORT, CORS_ORIGIN, JWT_SECRET ayarla (varsayılan uygundur)
npm run dev
```

- Health:    GET http://localhost:4000/api/health
- Swagger:   GET http://localhost:4000/api/docs
- Register:  POST http://localhost:4000/api/auth/register  { "email":"a@a.com","password":"123456" }
- Login:     POST http://localhost:4000/api/auth/login     { "email":"a@a.com","password":"123456" }
- List Tx:   GET  http://localhost:4000/api/transactions
- Add Tx:    POST http://localhost:4000/api/transactions   { "type":"INCOME","amount":1000 }

## Frontend `.env`
```
VITE_API_URL=http://localhost:4000/api
VITE_API_KEY=
```
