# PulseBoard

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A real-time endpoint monitoring dashboard built with Next.js and Supabase. PulseBoard helps you monitor the health and performance of your APIs and web services with ease.

## ✨ Features

- **🔍 Endpoint Monitoring** - Continuously monitor your API endpoints
- **⚡ Real-time Updates** - Get instant notifications about your endpoints' status
- **📊 Performance Metrics** - Track response times and uptime statistics
- **🔔 Failure Notifications** - Receive alerts when endpoints go down
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🔐 Secure Authentication** - Built-in user authentication with Supabase Auth
- **📈 Analytics Dashboard** - Visualize your endpoint performance with beautiful charts
- **🔄 Scheduled Checks** - Configure custom check intervals for each endpoint

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/lamalmeida/PulseBoard.git
   cd pulseboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and update the values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## 🛠️ Project Structure

```
pulseboard/
├── app/                    # App router
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── protected/         # Protected routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── public/                # Static files
└── types/                 # TypeScript type definitions
```

## 📦 Dependencies

- **Frontend**:
  - Next.js 14 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Chart.js for data visualization

- **Backend**:
  - Supabase (Auth & Database)
  - QStash for scheduled tasks
  - Resend for email notifications

## 📊 Database Schema

### `endpoints` Table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `name` - Text
- `url` - Text
- `check_interval` - Integer (in minutes)
- `is_active` - Boolean
- `created_at` - Timestamp
- `updated_at` - Timestamp

### `checks` Table
- `id` - UUID (Primary Key)
- `endpoint_id` - UUID (Foreign Key to endpoints)
- `status` - Text (e.g., 'up', 'down', 'error')
- `response_time` - Integer (in ms)
- `status_code` - Integer (nullable)
- `error_message` - Text (nullable)
- `checked_at` - Timestamp

## 🚀 Deployment

### Vercel

1. Push your code to a GitHub/GitLab repository
2. Import the repository to Vercel
3. Add your environment variables
4. Deploy!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/)
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)