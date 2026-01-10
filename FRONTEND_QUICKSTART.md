# NHL Companion Frontend - Quick Start

## 🚀 Get Started in 5 Minutes

### Prerequisites
- ✅ API service running at `http://localhost:8000`
- ✅ Database populated with team data
- ✅ API bearer token from `services/.env`

### Step 1: Create Environment File

```bash
cd frontend
copy env.example .env.local
```

Edit `.env.local` and add your API bearer token:
```env
API_BEARER_TOKEN=your-actual-token-from-services-env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Step 2: Install and Run

```bash
npm install
npm run dev
```

### Step 3: Open Browser

Visit: **http://localhost:3000**

## ✅ What You'll See

### Home Page
- Grid of all active NHL teams
- Team logos and names
- Status badges showing:
  - 🔴 **LIVE** - Game in progress
  - 📅 **Upcoming Today** - Game scheduled today
  - ✓ **Completed Today** - Game finished today
  - **No game today** - No game scheduled

### Team Detail Page
Click any team to see:
- Team logo and full name
- Today's game details (if exists)
- Score, opponent, venue
- Period, clock, shots on goal
- Game status indicator

## 🔧 Troubleshooting

### Error: "Authentication failed"
```bash
# Check that tokens match
# In services/.env:
API_BEARER_TOKEN=abc123

# In frontend/.env.local:
API_BEARER_TOKEN=abc123
```

### Error: "Failed to load teams"
```bash
# Ensure API is running
cd services/api
python api_app.py

# Should see: "Starting NHL Companion API on 0.0.0.0:8000"
```

### No teams showing up
```bash
# Populate database
cd services/db
python app.py sync-teams-records
python app.py sync-schedule
```

## 📚 Documentation

- **Complete Guide**: `frontend/README.md`
- **Setup Details**: `frontend/SETUP.md`
- **Implementation**: `frontend/IMPLEMENTATION_SUMMARY.md`
- **API Contract**: `services/api/API_CONTRACT.md`

## 🎯 Key Features

✅ Server-side rendering (fast page loads)
✅ Real-time game status
✅ Responsive design
✅ TypeScript type safety
✅ Secure API authentication
✅ Error handling

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Home - teams grid
│   └── team/[teamId]/
│       └── page.tsx       # Team detail page
├── lib/
│   ├── api-client.ts      # API integration
│   └── utils.ts           # Helper functions
├── types/
│   └── api.ts             # TypeScript types
└── .env.local             # Your config (create this!)
```

## 🔄 Development Workflow

1. Make changes to files in `app/`, `lib/`, or `types/`
2. Save - Next.js auto-reloads
3. Check browser at `http://localhost:3000`
4. Check terminal for errors

## 🎨 Customization Ideas

The bare-bones implementation is complete. You can now:
- Add custom styling
- Implement live polling for game updates
- Add player roster views
- Create play-by-play visualizations
- Add search and filter features
- Implement favorite teams

## ✨ Next Steps

1. ✅ Get the app running (follow steps above)
2. Explore the code in `app/page.tsx`
3. Check out the team detail page code
4. Review the API client in `lib/api-client.ts`
5. Start customizing!

---

**Need Help?** Check the documentation files or review the implementation summary.

