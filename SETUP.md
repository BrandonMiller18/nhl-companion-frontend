# Quick Setup Guide

Follow these steps to get the NHL Companion frontend running:

## Step 1: Ensure API Service is Running

Before starting the frontend, make sure the API service is running:

```bash
# In a separate terminal
cd services/api
python api_app.py
```

The API should be accessible at `http://localhost:8000`.

## Step 2: Create Environment File

Create a `.env.local` file in the `frontend/` directory:

```bash
# Copy the example file
copy env.example .env.local
```

Edit `.env.local` and add your API bearer token (must match the token in `services/.env`):

```env
API_BEARER_TOKEN=your-secret-token-here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Open in Browser

Visit `http://localhost:3000` in your browser.

## Verification

You should see:
- A grid of NHL team logos and names
- Status badges showing which teams have games today
- Clicking a team takes you to the team detail page

## Troubleshooting

### "Authentication failed" error
- Check that `API_BEARER_TOKEN` in `.env.local` matches `services/.env`
- Verify the API service is running

### No teams showing
- Ensure the database has been populated: `cd services/db && python app.py sync-teams-records`
- Check API service logs for errors

### Port 3000 already in use
- Stop other Next.js apps or use a different port: `npm run dev -- -p 3001`

## What's Next?

- Explore the home page to see all teams
- Click on any team to view their detail page
- Check if any teams have live games today
- Review the code in `app/page.tsx` and `app/team/[teamId]/page.tsx`

