# PulseBoard

A real-time endpoint monitoring dashboard built with Next.js and Supabase.

## Features

- 🔍 Monitor API endpoint health
- ⚡ Real-time status checks
- 📊 Response time tracking
- 🔐 Secure authentication with Supabase
- 🎨 Modern UI with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```

3. Copy `.env.example` to `.env.local` and add your Supabase credentials:
```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

4. Run the development server:
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Create these tables in your Supabase database:

### `endpoints` table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `name` (text)
- `url` (text)
- `check_interval` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)

### `checks` table
- `id` (uuid, primary key)
- `endpoint_id` (uuid, foreign key to endpoints)
- `status` (text)
- `response_time` (integer)
- `status_code` (integer, nullable)
- `error_message` (text, nullable)
- `checked_at` (timestamp)

## Tech Stack

- **Framework**: Next.js 16
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript