# Guess the Frame

A movie quiz web app where players guess a movie from a single frame under time pressure.

## Overview

Guess the Frame is built with Next.js and Supabase. Players choose a mode (Hollywood, Bollywood, or Mixed), reveal each frame, and submit answers before the timer ends. The app includes fuzzy answer matching, time-based scoring, and an admin panel to manage frames and packs.

## Features

- Multiple game modes: `hollywood`, `bollywood`, `mixed`
- 20-frame game session (or fewer if less data exists)
- Time-based scoring with speed bonus
- Fuzzy answer matching (typo-tolerant)
- Results screen with score, accuracy, and grade
- Admin panel for uploading and managing movie frames
- TMDb movie info fetch API for quick admin input

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Supabase (Database + Storage)
- TMDb API

## Project Structure

```text
guess-the-frame/
  src/
    app/
      admin/
      api/tmdb-fetch/
      game/
      play/
      results/
    components/
    hooks/
    lib/
```

## Prerequisites

- Node.js 18+
- npm
- Supabase project with required tables/storage
- TMDb API key

## Environment Variables

Copy `.env.local` and fill values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.



## Gameplay Rules

- Select a mode from the Play screen
- Reveal frame to start the 20-second timer
- Submit movie title before time runs out
- Correct answers score points based on speed
- Move through all frames to complete the session

Scoring logic:

- Correct answer base score with time bonus
- Maximum expected score per frame: `15`

## Admin Workflow

- Go to `/admin`
- Upload frame images and associate with movies
- Optionally fetch movie metadata by TMDb ID
- Manage frames and packs from admin pages

## Notes

- The game fetches frames from Supabase and shuffles them each session.
- Mixed mode includes all available movies.
- Hollywood/Bollywood modes include entries marked for that genre (plus shared entries if configured as `both`).

## Owner

Rushikesh Gayke
