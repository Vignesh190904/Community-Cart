# Admin Portal

This is the admin portal for the Community Cart platform, built with React and Vite.

## Features

- **Dashboard**: Overview of platform statistics and metrics
- **Vendor Management**: Create, view, edit, and delete vendor accounts
- **Vendor Analytics**: Detailed analytics and performance metrics for each vendor
- **Authentication**: Secure admin login system

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## API Endpoints

The admin portal communicates with the backend API at `http://localhost:8000` (hardcoded):

- `POST /auth/admin/login` - Admin login
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/vendors` - Get all vendors
- `POST /admin/vendors/create` - Create new vendor
- `PUT /admin/vendors/:id` - Update vendor
- `DELETE /admin/vendors/:id` - Delete vendor
- `GET /admin/vendors/:id/stats` - Vendor statistics
- `GET /admin/vendors/:id/metrics` - Vendor metrics

## Authentication

The admin portal uses a custom authentication system that integrates with the backend API. Admin credentials are stored securely and managed through the backend.

**Default Admin Credentials:**
- **Email**: `admin@admin.com`
- **Password**: `12345678`

## Components

- **Dashboard**: Main overview page with statistics and charts
- **Vendors**: Vendor management page with CRUD operations
- **VendorProfile**: Detailed vendor analytics and performance metrics
- **Login**: Admin authentication page

## Dependencies

- React 18
- React Router DOM
- Axios for API calls
- Recharts for data visualization
- Lucide React for icons
- Tailwind CSS for styling
- Radix UI for accessible components
