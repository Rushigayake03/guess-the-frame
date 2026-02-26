# Guess the Frame

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A movie quiz web app where players guess a movie from a single frame under time pressure.

## Overview

Guess the Frame is built with Next.js and Supabase. Players choose a mode (Hollywood, Bollywood, or Mixed), reveal each frame, and submit answers before the timer ends. The app includes fuzzy answer matching, time-based scoring, and an admin panel to manage frames and packs.

## Features

- **Multiple game modes**: `hollywood`, `bollywood`, `mixed`
- **20-frame game session** (or fewer if less data exists)
- **Time-based scoring** with speed bonus
- **Fuzzy answer matching** (typo-tolerant)
- **Results screen** with score, accuracy, and grade
- **Admin panel** for uploading and managing movie frames
- **TMDb integration** for movie info fetch API for quick admin input

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Supabase** (Database + Storage)
- **PostgreSQL**
- **TMDb API**
- **Lucide React** (Icons)
- **shadcn/ui** (UI Components)

## Project Structure

```text
guess-the-frame/
  src/
    app/
      admin/         # Admin dashboard for content management
      api/           # API routes (TMDb fetch)
      game/          # Main game page
      play/          # Mode selection page
      results/       # Results page after game completion
    components/      # Reusable React components
    hooks/           # Custom React hooks (useGameSession)
    lib/             # Utility functions and configurations
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with required tables/storage
- TMDb API key

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/guess-the-frame.git

# Navigate to project directory
cd guess-the-frame

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Gameplay Rules

1. Select a mode from the Play screen
2. Reveal frame to start the 20-second timer
3. Submit movie title before time runs out
4. Correct answers score points based on speed
5. Move through all frames to complete the session

### Scoring Logic

- Base score: **10 points** for correct answer
- Speed bonus: **+5 points** if answered within 5 seconds
- Maximum score per frame: **15 points**
- Total possible score (20 frames): **300 points**

### Scoring Breakdown

| Time Range | Points |
|-----------|--------|
| 0-5 seconds | 15 |
| 6-10 seconds | 12-14 |
| 11-20 seconds | 10-11 |

## Admin Workflow

1. Navigate to `/admin` (authentication required)
2. Upload frame images and associate with movies
3. Fetch movie metadata automatically using TMDb ID
4. Manage frames, packs, and movie database
5. Organize content by genre (Hollywood/Bollywood/Both)

## Database Schema

### Tables

- **movies**: Store movie information (title, year, genre, TMDb ID)
- **frames**: Store frame images linked to movies
- **packs**: Group frames into themed collections
- **admins**: Manage admin access

## Features Breakdown

### Game Logic
- Session-based gameplay using React hooks
- Real-time timer with millisecond precision
- Fuzzy answer matching algorithm for typo tolerance
- Dynamic scoring calculation based on response time

### UI/UX
- Cinematic design with film strip decorations
- Smooth CSS animations (scale, particle burst, shake effects)
- Audio feedback for correct/wrong answers
- Responsive design for all screen sizes
- Lucide React icons for modern, clean interface

### Admin Features
- TMDb API integration for quick movie data import
- Image upload to Supabase storage
- CRUD operations for frames and packs
- Content filtering by genre

## Notes

- The game fetches frames from Supabase and shuffles them each session
- Mixed mode includes all available movies
- Hollywood/Bollywood modes include entries marked for that genre (plus shared entries if configured as `both`)
- Answer matching is case-insensitive and tolerates minor typos



## Owner

**Rushikesh Gayke**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rushigayake03)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/rushikesh-gayake-518a3a342)

---
