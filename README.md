# KnowingApp — Full-stack Bible Flashcard Game

![KnowingApp Banner](https://img.shields.io/badge/KnowingApp-Bible%20Flashcards-blue?style=for-the-badge&logo=open-book-emoji)

## Overview

KnowingApp is a full-stack flashcard quiz application focused on Bible knowledge. Users can sign up/sign in, choose question groups (Old Testament, New Testament, Pentateuch, Prophets, Gospels, Epistles), answer flashcards, and flip cards to reveal answers. The app tracks progress, scores, and provides spaced repetition suggestions for optimal learning.

## Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **100+ Bible Questions**: Pre-seeded database with questions organized by canonical groupings
- **Interactive Flashcards**: Beautiful flip animations and smooth UX
- **Spaced Repetition**: SM-2 inspired algorithm for optimal learning
- **Progress Tracking**: Track attempts, correct rate, and review schedules
- **Responsive Design**: Mobile-first design that works on all devices
- **RESTful API**: Clean API architecture for all operations

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management

### Backend
- **Next.js API Routes**
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **Bcrypt** for password hashing

### Database
- **PostgreSQL** (recommended)
- Or any Prisma-supported database

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Git

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd puzzler
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the project root with the following (safe defaults for local dev):

```env
# Database
DATABASE_URL="postgresql://knowing:knowing@localhost:5432/knowingapp?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# JWT
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
```

**Generate secure secrets:**

```bash
openssl rand -base64 32
```

4. **Start PostgreSQL with Docker (recommended for local dev)**

If you have Docker Desktop installed, start a local Postgres container:

```bash
docker run -d --name knowingapp-db \
  -e POSTGRES_USER=knowing \
  -e POSTGRES_PASSWORD=knowing \
  -e POSTGRES_DB=knowingapp \
  -p 5432:5432 \
  -v knowingapp_pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

Wait a few seconds for the DB to be ready.

5. **Set up the database schema and seed data**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with 100+ Bible questions
npm run db:seed
```

6. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users
- `id` (String, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `password` (String, Hashed)
- `createdAt`, `updatedAt` (DateTime)

### Decks
- `id` (String, Primary Key)
- `slug` (String, Unique)
- `name` (String)
- `description` (String, Optional)
- `category` (String) - "Old Testament" or "New Testament"

### Questions
- `id` (String, Primary Key)
- `deckId` (Foreign Key → Decks)
- `frontText` (String) - The question
- `backText` (String) - The answer
- `scriptureRefs` (JSON) - Array of scripture references
- `difficulty` (Int) - 1-5 scale

### UserProgress
- `id` (String, Primary Key)
- `userId` (Foreign Key → Users)
- `questionId` (Foreign Key → Questions)
- `lastReviewed` (DateTime)
- `intervalDays` (Int) - Days until next review
- `easeFactor` (Float) - SM-2 ease factor
- `repetition` (Int) - Number of successful repetitions
- `nextReviewAt` (DateTime)
- `correctCount`, `incorrectCount` (Int)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Decks & Questions

- `GET /api/decks` - List all decks (filter by category)
- `GET /api/decks/:id` - Get deck details
- `GET /api/decks/:id/questions` - Get questions for a deck

### Progress

- `POST /api/progress/answer` - Submit answer and update progress
- `GET /api/progress` - Get user progress summary

## Spaced Repetition Algorithm

The app uses an SM-2 inspired spaced repetition algorithm:

- **Correct Answer**: Increases repetition count, extends interval, slightly increases ease factor
- **Incorrect Answer**: Resets repetition to 0, sets interval to 1 day, decreases ease factor

**Intervals**:
- First review: 1 day
- Second review: 6 days
- Subsequent reviews: Previous interval × ease factor

## Demo Account

The seed script creates a demo account:

- **Email**: demo@knowingapp.com
- **Password**: demo123

## Available Decks

The seed includes questions from these canonical groupings:

### Old Testament
- **Pentateuch** (15 questions) - Genesis through Deuteronomy
- **Historical Books** (15 questions) - Joshua, Judges, Ruth, Samuel, Kings, etc.
- **Poetry & Wisdom** (10 questions) - Psalms, Proverbs, Job, Ecclesiastes
- **Major Prophets** (10 questions) - Isaiah, Jeremiah, Ezekiel, Daniel
- **Minor Prophets** (10 questions) - Hosea, Joel, Amos, Jonah, etc.

### New Testament
- **Gospels** (20 questions) - Matthew, Mark, Luke, John
- **Acts** (10 questions) - Acts of the Apostles
- **Pauline Epistles** (10 questions) - Romans, Corinthians, Galatians, etc.
- **General Epistles** (8 questions) - James, Peter, John, Jude, Hebrews
- **Revelation** (8 questions) - Book of Revelation

**Total**: 100+ questions across 10 decks

## Project Structure

```
puzzler/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed script
│   └── seed-questions.csv     # 100 Bible questions
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── decks/         # Deck endpoints
│   │   │   └── progress/      # Progress tracking
│   │   ├── decks/             # Decks page
│   │   ├── quiz/[id]/         # Quiz page (dynamic route)
│   │   ├── login/             # Login page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── AuthForm.tsx       # Login/Signup form
│   │   ├── DeckList.tsx       # Deck browser
│   │   ├── Flashcard.tsx      # Flashcard component
│   │   └── QuizView.tsx       # Quiz interface
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       ├── auth.ts            # Auth utilities
│       └── spaced-repetition.ts # SR algorithm
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Linting
npm run lint             # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Railway / Render

1. Create a PostgreSQL database
2. Set environment variables
3. Run build and start commands
4. Deploy!

## Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-new-secret-for-production"
JWT_SECRET="generate-new-secret-for-production"
JWT_REFRESH_SECRET="generate-new-secret-for-production"
NODE_ENV="production"
```

## Future Enhancements

- [ ] Admin panel for adding/editing questions
- [ ] CSV import/export for questions and progress
- [ ] Daily review reminders
- [ ] Achievement badges and streaks
- [ ] Social features (leaderboards, challenges)
- [ ] Mobile apps (React Native)
- [ ] Offline mode with service workers
- [ ] Audio pronunciation for scripture references
- [ ] Study notes and bookmarks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and building.

## Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for Bible study enthusiasts**
