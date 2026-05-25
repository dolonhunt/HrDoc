# DocHR v2.0

Modern HR document generator for Bangladesh payroll workflows. Completely redesigned with a dashboard, dark mode, working settings, CSV import/export, document history, and dynamic branding.

## Stack
- Next.js 16 (App Router)
- Prisma + SQLite
- Tailwind CSS v4 + shadcn/ui
- Puppeteer for PDF rendering
- next-themes for Dark Mode

## What's New in v2.0

### Dashboard
- New landing page with stats cards (total employees, payroll summary, document types, avg salary)
- Quick action links to all document generators
- Recent employees list with one-click document generation

### Dark Mode
- System-aware dark mode with manual toggle
- Full dark theme support across all UI components
- Theme switcher in sidebar footer

### Working Settings Page
- Edit company name, address, phone, email
- Upload company logo (base64, works on all deployments)
- Pick brand color from 20 preset swatches
- Edit proprietor name and designation
- Real-time preview of branding changes
- All changes persist to database

### Dynamic Branding
- Company name and logo used in sidebar header (no longer hardcoded to "Beyond Headlines")
- Brand color applied consistently across all buttons, accents, and indicators
- Company info flows through to document templates automatically

### Employee CSV Import/Export
- Export all employees to CSV with one click
- Bulk import employees from CSV files
- Supports: Name, Designation, Department, Basic, House Rent, Conveyance, Medical, Food & Mobile, Cash, Tax, and all other fields
- Auto-calculates Gross and Net during import

### Document History
- Tracks all generated documents with employee name, document type, and timestamp
- Searchable history log
- Delete individual records or clear all
- Data stored in localStorage for persistence

### Visual Polish
- Skeleton loading states on startup
- Refined empty states with helpful CTAs
- Smooth transitions and hover effects
- Better typography hierarchy
- Card-based layouts throughout

### Architecture Improvements
- Monolithic 744-line page refactored into 6 focused components
- Component-based architecture for better maintainability
- Proper loading states and error handling
- Cleaner separation of concerns

## Local Setup
1. Install dependencies:
   - `npm install`
2. Prepare environment:
   - `cp .env.example .env`
3. Generate Prisma client:
   - `npm run db:generate`
4. Initialize DB schema:
   - `npm run db:push`
5. Start dev server:
   - `npm run dev`

## Production Checks
- `npm run lint`
- `npm run build`
- `npm run start`

## Data Model
- Employees and company settings stored in SQLite via Prisma
- First run seeds default company and one employee via `POST /api/bootstrap`

## Vercel Deployment
- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Environment:
  - `DATABASE_URL=file:./db/custom.db`

**Note:** SQLite works for single-instance deployments. For multi-instance or high-traffic production, migrate to PostgreSQL (Neon, Supabase, etc.).
