# PseudoLawyer

AI-powered contract negotiation platform built with Next.js 15, Supabase, and OpenRouter.

## Features

- 🔐 **User Authentication** - Secure login/register with Supabase Auth
- 📝 **Contract Templates** - Pre-built templates (Freelance Agreement, NDA)
- 💬 **Real-time Chat** - Supabase Realtime for instant messaging
- 🤖 **AI Mediator** - "Sudo" helps negotiate fair terms via OpenRouter
- 📄 **Contract Generation** - Finalize and download completed contracts

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: OpenRouter (Claude 3.5 Sonnet)
- **Icons**: Lucide React

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_templates.sql`
3. Copy your project URL and keys from Settings > API

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Flow

1. **Register** two users in your app
2. **Login** as User A and start a new negotiation
3. Enter User B's email as the counterparty
4. **Open another browser** and login as User B
5. Both users can now chat with AI mediation
6. When ready, click "Finalize Contract"
7. Download the completed contract

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected routes
│   ├── api/chat/             # AI chat endpoint
│   ├── login/                # Auth pages
│   ├── register/
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Base components
│   └── navigation/           # Navbar
├── hooks/                    # React hooks
│   ├── use-auth.ts
│   └── use-chat.ts
├── lib/
│   ├── supabase/             # Supabase clients
│   └── openrouter.ts         # AI integration
└── types/                    # TypeScript types
```

## License

MIT