# Bussin Bean

Bussin Bean is a React/Vite storefront with a Node.js/Express API, SQLite persistence, admin authentication, menu management, orders, reviews, and discounts.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A terminal opened in the project folder

Check your versions:

```bash
node --version
npm --version
```

## Install

Install frontend and backend dependencies:

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Command Prompt:

```cmd
copy .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_INITIAL_PASSWORD=replace-with-your-admin-password
REVIEW_DISCOUNT_PERCENT=10
CLIENT_ORIGIN=http://localhost:5173
```

Use a long random value for `JWT_SECRET`. Never commit `.env` or expose it in frontend code.

`ADMIN_INITIAL_PASSWORD` is used only when the SQLite database has no admin account yet. Once the database exists, change the password from the admin panel using **Change password**.

## Development

Start the API and Vite frontend together:

```bash
npm run dev:full
```

The API runs at:

```text
http://localhost:3001
```

The Vite development site runs at:

```text
http://localhost:5173
```

You can also run them separately:

```bash
npm run server
npm run dev
```

Keep both processes running during development.

## Admin Panel

1. Open the storefront.
2. Select **STAFF** in the navigation.
3. Enter the password from `ADMIN_INITIAL_PASSWORD`.
4. Use the admin panel to manage:
   - Orders and order status
   - Menu items, prices, images, stock, and public discounts
   - Customer-specific discounts
   - Review approval and hiding
   - Store override
   - Admin password changes

The default development fallback password is `1234` only when no `.env` password is configured and no database exists. Set `ADMIN_INITIAL_PASSWORD` before launch.

## Production Build

Build the frontend and compiled API:

```bash
npm run build
```

This runs:

1. The frontend TypeScript check
2. The Vite production build
3. The server TypeScript compilation into `server/dist`

Start the compiled application:

```bash
npm start
```

The Express server serves both the API and the built storefront at:

```text
http://localhost:3001
```

For production, set:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-long-random-secret
ADMIN_INITIAL_PASSWORD=your-secure-first-password
REVIEW_DISCOUNT_PERCENT=10
CLIENT_ORIGIN=https://your-domain.example
```

In production, the server refuses to start if `JWT_SECRET` or `ADMIN_INITIAL_PASSWORD` is missing.

## Database

SQLite data is stored in:

```text
data/bussin-bean.sqlite
```

The server creates the `data` directory and database automatically on first startup. The database contains:

- Admin password hash
- Menu items
- Orders
- Reviews
- Customer discount consent and redemption state
- Customer discounts

Back up the `data` directory before moving or updating the deployment.

## Review Discount Flow

Customers can submit a review and optionally provide a phone number, email, or member ID. They must explicitly check the consent box before a one-time review discount is created.

The discount is:

- Created only when consent is checked
- Associated with the submitted customer identifier
- Available once
- Redeemed after a successful order
- Not reusable after redemption

The percentage is configured with `REVIEW_DISCOUNT_PERCENT`.

## Store Hours

Customer ordering is enabled from 11:00 AM until 1:00 AM local time. The admin panel includes an emergency store override.

## API Smoke Test

With the server running, test the public menu endpoint:

PowerShell:

```powershell
Invoke-RestMethod http://localhost:3001/api/menu
```

Test admin login:

```powershell
$body = @{ password = $env:ADMIN_INITIAL_PASSWORD } | ConvertTo-Json
Invoke-RestMethod http://localhost:3001/api/auth/login -Method Post -ContentType 'application/json' -Body $body
```

A successful login returns a JWT token.

## Launch Checklist

- [ ] `npm install` completed
- [ ] `.env` created from `.env.example`
- [ ] Strong `JWT_SECRET` configured
- [ ] Strong `ADMIN_INITIAL_PASSWORD` configured
- [ ] `npm run build` passes
- [ ] `npm start` starts successfully
- [ ] Storefront loads at the production URL
- [ ] Admin login works
- [ ] Admin password is changed after first login
- [ ] Menu item create/edit/delete works
- [ ] Image upload works
- [ ] Customer order reaches the admin order queue
- [ ] Admin status changes are visible to the customer
- [ ] Review submission and moderation work
- [ ] Discount consent and one-time redemption work
- [ ] SQLite `data` directory is backed up
- [ ] HTTPS is enabled at the hosting layer

## Security Notes

- Do not use the development fallback password in production.
- Do not commit `.env` or SQLite database files.
- Use HTTPS in production.
- Restrict `CLIENT_ORIGIN` to the real frontend origin.
- Keep the API and Node.js dependencies updated.
- Configure regular backups for the SQLite database.
"# bussin-Bean" 
