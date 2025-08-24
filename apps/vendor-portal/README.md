# Community Cart - Vendor Portal

A modern, production-ready vendor portal built with React, Vite, TailwindCSS, and React Query. This application allows vendors to manage their products, orders, and store settings within the Community Cart ecosystem.

## Features

### Completed Features
- **Authentication & Authorization**
  - Supabase Auth integration with JWT tokens
  - Role-based access control
  - Protected routes and auth guards
  - Password reset functionality

- **Dashboard**
  - Real-time metrics and KPIs
  - Recent orders overview
  - Low stock alerts
  - Quick action buttons
  - Revenue tracking

Navigate to the `vendor-portal` directory and install the required Node.js packages:

```bash
cd apps/vendor-portal
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `apps/vendor-portal` directory and add your Supabase credentials. You can copy the content from `.env.example`.

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase project URL and public (anon) key.

### 3. Run Locally

Start the development server:

```bash
npm start
```

### 4. Preview

The Vendor Portal will be accessible at:

[http://localhost:5000](http://localhost:5000) (hardcoded)
