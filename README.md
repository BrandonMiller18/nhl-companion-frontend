# NHL Companion Frontend

A Next.js 14+ application that displays NHL teams, games, and live scores using the NHL Companion API.

## Features

- **Teams Grid**: View all active NHL teams with their logos
- **Game Status Indicators**: See which teams have live, upcoming, or completed games today
- **Team Detail Pages**: Click on any team to view detailed information and today's game
- **Live Game Monitoring**: Real-time play-by-play updates for live games
- **Timezone Support**: View games in your local timezone
- **Real-time Data**: Fetches live game data from the NHL Companion API

## Architecture

This frontend application:
- Built with **Next.js 14** (App Router)
- Styled with **Tailwind CSS**
- Deployed on **Vercel**
- Communicates with NHL Companion API (FastAPI on Heroku)
- Uses Next.js API routes as a proxy layer (keeps API token server-side)

## Prerequisites

- Node.js 18+ and npm
- NHL Companion API service (local or deployed)
- API Bearer Token from the API service

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your API bearer token:

```bash
# Create .env.local from the example
copy env.example .env.local
```

Edit `.env.local` and set your configuration:

```env
# API Configuration (server-side only, not exposed to browser)
API_BEARER_TOKEN=your-actual-token-here
API_BASE_URL=http://localhost:8001

# Feature Flags
NEXT_PUBLIC_ENABLE_TEST_MODE=false
```

**Important Notes:**
- `API_BEARER_TOKEN` should match the token configured in your API service
- `API_BASE_URL` should point to your API service (local: `http://localhost:8001`, production: your Heroku URL)
- Variables without `NEXT_PUBLIC_` prefix are server-side only (more secure)

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (teams grid)
│   ├── globals.css         # Global styles
│   └── team/
│       └── [teamId]/
│           └── page.tsx    # Team detail page
├── lib/
│   ├── api-client.ts       # API client with authentication
│   └── utils.ts            # Utility functions
├── types/
│   └── api.ts              # TypeScript type definitions
└── env.example             # Environment variables template
```

## How It Works

### Game Status Logic

The application determines game status for each team based on today's games:

- **🔴 LIVE**: Team has a game with state `LIVE` or `CRIT`
- **📅 Upcoming Today**: Team has a game with state `FUT`
- **✓ Completed Today**: Team has a game with state `FINAL` or `OFF`
- **No game today**: Team has no scheduled game today

### API Integration

All API calls are made server-side using Next.js Server Components:

- Bearer token is kept secure (not exposed to browser)
- Data is fetched at request time (no caching for real-time updates)
- Error handling for all API responses

### Pages

#### Home Page (`/`)

- Fetches all active teams
- Fetches today's games
- Displays teams in a responsive grid
- Shows game status badge for each team
- Links to team detail pages

#### Team Detail Page (`/team/[teamId]`)

- Displays team logo and name
- Shows today's game information (if exists):
  - Game status (live/upcoming/completed)
  - Score and opponent
  - Period and clock
  - Venue and game details
  - Shots on goal
- Displays "No game scheduled today" if no game

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `API_BEARER_TOKEN`
   - `API_BASE_URL` (your Heroku API URL)
   - `NEXT_PUBLIC_ENABLE_TEST_MODE=false`
4. Deploy!

## API Endpoints Used

The frontend consumes the following API endpoints via Next.js API routes:

- `GET /api/teams/active` - Fetch all active NHL teams
- `GET /api/teams/{teamId}/players` - Fetch team roster
- `GET /api/games?date={YYYY-MM-DD}&timezone={timezone}` - Fetch games for a date
- `GET /api/games/{gameId}` - Fetch game details with play-by-play
- `GET /api/players/{playerId}` - Fetch player details

## Troubleshooting

### "Authentication failed" Error

**Local Development:**
- Ensure your `API_BEARER_TOKEN` in `.env.local` matches the token in your API service
- Verify the API service is running

**Production:**
- Check environment variables in Vercel dashboard
- Verify API service is accessible from Vercel

### "Failed to load teams" Error

**Local Development:**
- Check that the API service is running: `python api_app.py` in API repo
- Verify the database has data
- Check the API URL in `.env.local` is correct

**Production:**
- Verify `API_BASE_URL` is set correctly in Vercel
- Check API service health: `curl https://your-api.herokuapp.com/health`
- Check Vercel function logs

### CORS Errors

- Update CORS configuration in API service to include your Vercel domain
- Redeploy API service after CORS changes

### Teams or Games Not Showing

- Ensure the database has been populated with data (via DB CLI service)
- Check the API service logs for errors
- Verify the date format is correct (YYYY-MM-DD)
- Check browser console for JavaScript errors

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers (proxy to backend)
│   ├── live/[gameId]/     # Live game page
│   ├── team/[teamId]/     # Team detail page
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── live/             # Live game components
├── lib/                   # Utilities
│   ├── api-client.ts     # API client functions
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
│   └── api.ts            # API response types
└── public/               # Static assets
```

## Related Repositories

- **API Service**: NHL Companion API (FastAPI on Heroku)
- **DB CLI Service**: NHL Companion DB CLI (data sync on Heroku)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT
