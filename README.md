# MyFirst Fragrances — Backend (Node.js + Express)

A production‑ready REST API for an e‑commerce perfume store.

- Tech: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, Cloudinary, CORS, dotenv
- Name: "MyFirst Fragrances"
- Port: 4000 (configurable via `PORT`)

## Features
- Admin authentication (register/login) with JWT
- Product management (CRUD): name, description, price, category, stock, image, isPromotion
- Public product listing and details
- Image upload to Cloudinary via multipart/form‑data
- Secured admin routes with Bearer token

## Project structure
```
/myfirst-backend
  .env
  .gitignore
  package.json
  server.js
  /config
    db.js
  /controllers
    authController.js
    productController.js
  /middleware
    authMiddleware.js
  /models
    Product.js
    User.js
  /routes
    authRoutes.js
    productRoutes.js
```

## Requirements
- Node.js 18+ (LTS recommended)
- A MongoDB instance (Atlas or local)
- Cloudinary account for image uploads

## Environment variables (.env)
Create and fill `.env` at the repo root:
```
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Tips:
- If your MongoDB password contains special characters, URL‑encode it (e.g. `@` → `%40`, `#` → `%23`).
- For MongoDB Atlas, whitelist your IP or use a secure allowlist.

## Install and run
```bash
# install deps
npm install

# dev mode (auto‑reload)
npm run dev

# production
npm start
```
Server will log, for example: `MyFirst Fragrances backend listening on port 4000`.

## API
Base URL: `http://localhost:4000`

### Auth
- POST `/api/auth/register`
  - body JSON: `{ "name": "Admin", "email": "admin@example.com", "password": "secret123" }`
  - response: `{ success, message, data: { token, user } }`

- POST `/api/auth/login`
  - body JSON: `{ "email": "admin@example.com", "password": "secret123" }`
  - response: `{ success, message, data: { token, user } }`

Include the JWT in admin routes using header: `Authorization: Bearer <token>`

### Products (public)
- GET `/api/products` — list all products
- GET `/api/products/:id` — product details

### Products (admin, protected)
- POST `/api/admin/products` — create
  - Content‑Type: `multipart/form-data`
  - fields:
    - `name` (string, required)
    - `description` (string, required)
    - `price` (number, required)
    - `category` (string, required)
    - `stock` (number, required)
    - `isPromotion` (boolean, optional)
    - `image` (file, optional) — uploaded to Cloudinary
- PUT `/api/admin/products/:id` — update (same fields as above)
- DELETE `/api/admin/products/:id` — delete

All responses are JSON: `{ success: boolean, message: string, data?: any, error?: string }`.

## Example requests

### Register (PowerShell)
```powershell
$body = @{ name = "Admin"; email = "admin@example.com"; password = "secret123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" -ContentType "application/json" -Body $body
```

### Login and store token (PowerShell)
```powershell
$loginBody = @{ email = "admin@example.com"; password = "secret123" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/login" -ContentType "application/json" -Body $loginBody
$TOKEN = $loginResp.data.token
```

### Create product with image (curl)
```bash
curl -X POST "http://localhost:4000/api/admin/products" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Eau de Parfum" \
  -F "description=Floral and fresh" \
  -F "price=89.99" \
  -F "category=Women" \
  -F "stock=50" \
  -F "isPromotion=true" \
  -F "image=@./path/to/image.jpg"
```
PowerShell alternative (quote file path accordingly):
```powershell
curl.exe -X POST "http://localhost:4000/api/admin/products" `
  -H "Authorization: Bearer $TOKEN" `
  -F "name=Eau de Parfum" `
  -F "description=Floral and fresh" `
  -F "price=89.99" `
  -F "category=Women" `
  -F "stock=50" `
  -F "isPromotion=true" `
  -F "image=@C:\path\to\image.jpg"
```

## Troubleshooting
- `MongoDB connection error: bad auth : authentication failed`
  - Double‑check `MONGODB_URI` credentials and ensure password is URL‑encoded.
  - Atlas: verify Database User and IP access in the Atlas dashboard.
- 401/403 on admin routes:
  - Ensure you send `Authorization: Bearer <token>` from login response.
- Image upload fails:
  - Confirm Cloudinary env vars are set and valid.

## Scripts
- `npm run dev` — start with nodemon
- `npm start` — start with node

## Security notes
- `.gitignore` includes `.env`. Never commit secrets.
- Rotate `JWT_SECRET` if leaked.

## License
MIT (or your preferred license).
