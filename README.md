# Task Manager Application

## Overview
A modern, responsive task management application built with Next.js, Supabase, Tailwind CSS, and Framer Motion.

## Features
- **Authentication**: Secure email/password login and signup via Supabase.
- **Task Management**: Create, read, update, and delete tasks.
- **Real-time Updates**: Optimistic UI updates and server-side validation.
- **Responsive Design**: Fully responsive layout for mobile and desktop.
- **Modern UI**: "Premium" aesthetic using Shadcn UI components and smooth Framer Motion animations.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **UI Components**: Shadcn UI, Framer Motion, Lucide Icons
- **Deployment**: Vercel

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Run Locally**
   ```bash
   npm run dev
   ```

## Design Decisions (Assignment Answers)

### Why did you choose Firebase or Supabase for this assignment?
I chose **Supabase** because it provides a relational database (PostgreSQL) out of the box, which is often more suitable for structured data like tasks compared to Firebase's NoSQL document store. It also offers excellent type safety with TypeScript generation, row-level security (RLS) for robust access control, and seamless integration with Next.js through `@supabase/ssr`.

### What factors would make you choose the other option in a real production system?
I would choose **Firebase** if:
- The application required extremely high write throughput or real-time presence features (Firestore/Realtime DB shines here).
- The data structure was highly unstructured or constantly changing (Schema-less).
- The team was already deeply integrated into the Google Cloud ecosystem.
- We needed specific Firebase features like Cloud Messaging (FCM) for push notifications which is best-in-class.

### If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?
1. **Database Connection Limits**: Postgres has a limit on concurrent connections.
   - **Fix**: Use connection pooling (Supabase provides Transaction pooling via Supavisor) or implement server-side caching (Redis) for read-heavy operations.
2. **Read Latency**: Fetching tasks directly from the DB for every dashboard load.
   - **Fix**: Implement pagination (infinite scroll) instead of fetching all tasks, and add caching layers.
3. **Asset/Build Performance**: Initial load times might degrade.
   - **Fix**: CDN caching for static assets (Vercel handles this), standardize image optimization, and code-splitting (mostly handled by Next.js).

### One design or technical decision you made that you know is not ideal, but accepted due to time constraints.
I used **Client-Side Fetching/Updating** mixed with Server Actions for simple CRUD without a robust state management library like **TanStack Query**. 
- **Ideal**: Use TanStack Query for caching, deduping requests, and better optimistic updates.
- **Accepted**: Native `useRouter().refresh()` approach is simpler for a mini-app but causes full page/route data re-fetches, which is less efficient.

### How would you modify the system if:

#### Firebase/Supabase is removed
- I would implement a custom backend using **Node.js/Express** or **Next.js API Routes** with **Prisma ORM** connecting to a hosted PostgreSQL (e.g., AWS RDS or Neon).
- Authentication would be handled by **NextAuth.js** (Auth.js).

#### Role-based access is introduced
- I would add a `role` column to the `profiles` table (linked to `auth.users`).
- In Supabase, I would update RLS policies to check `auth.uid()` against the `profiles` table to determine permissions (e.g., `admin` can see all tasks).
- In the UI, I'd use middleware or a custom hook to protect admin routes.

#### Activity/audit logs are required
- I would create a new table `audit_logs` (id, user_id, action, resource, timestamp).
- I would use **Database Triggers** in Postgres to automatically insert a row into `audit_logs` whenever an `INSERT`, `UPDATE`, or `DELETE` occurs on important tables. This ensures logs are capturing at the database level, reliable even if the API layer is bypassed.
