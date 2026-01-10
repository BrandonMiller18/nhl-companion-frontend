# NHL Companion Frontend - Deployment Guide

This guide covers deploying the NHL Companion frontend to Vercel.

## Overview

The frontend is a Next.js application that:
- Displays NHL games, teams, and player information
- Provides live game monitoring with play-by-play updates
- Communicates with the NHL Companion API (hosted on Heroku)

## Prerequisites

- Vercel account (free tier available)
- GitHub account
- NHL Companion API deployed and accessible
- API Bearer Token from your API deployment

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**:
   In the Vercel dashboard, add these environment variables:
   
   - `API_BEARER_TOKEN`: Your API authentication token (same as API service)
   - `API_BASE_URL`: Your Heroku API URL (e.g., `https://your-api-app.herokuapp.com`)
   - `NEXT_PUBLIC_ENABLE_TEST_MODE`: Set to `false` for production

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Set Environment Variables**:
```bash
vercel env add API_BEARER_TOKEN
vercel env add API_BASE_URL
vercel env add NEXT_PUBLIC_ENABLE_TEST_MODE
```

5. **Deploy to Production**:
```bash
vercel --prod
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BEARER_TOKEN` | API authentication token (server-side only) | `your-secure-token-here` |
| `API_BASE_URL` | Backend API URL | `https://your-api-app.herokuapp.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_TEST_MODE` | Enable test mode for simulating games | `false` |

**Important**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. `API_BEARER_TOKEN` and `API_BASE_URL` are NOT prefixed, keeping them server-side only.

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Updating CORS on API

After deploying, update your API's CORS configuration to allow your Vercel domain:

In `api_app.py` on your API service:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "https://your-custom-domain.com"  # if using custom domain
    ],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
```

Redeploy your API service after making this change.

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Check analytics

### Testing Production Deployment

1. **Health Check**:
   - Visit your Vercel URL
   - Should see the home page with games

2. **API Connection**:
   - Check browser console for errors
   - Verify data loads correctly

3. **Test All Features**:
   - Browse games by date
   - View team rosters
   - Watch live games (if available)

## Troubleshooting

### API Connection Errors

**Problem**: "Failed to fetch" or CORS errors

**Solutions**:
1. Verify `API_BASE_URL` is set correctly in Vercel
2. Check API is running: `curl https://your-api-app.herokuapp.com/health`
3. Verify CORS is configured correctly on API
4. Check API bearer token matches

### Environment Variables Not Working

**Problem**: Environment variables not available

**Solutions**:
1. Verify variables are set in Vercel dashboard
2. Redeploy after adding/changing variables
3. Check variable names (case-sensitive)
4. For client-side variables, ensure `NEXT_PUBLIC_` prefix

### Build Failures

**Problem**: Deployment fails during build

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` and `package-lock.json` are committed
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Slow Performance

**Problem**: Pages load slowly

**Solutions**:
1. Enable Vercel Analytics
2. Check API response times
3. Verify images are optimized
4. Use Vercel's Edge Network features

## Local Development

To test with production API locally:

1. Create `.env.local`:
```bash
API_BEARER_TOKEN=your-production-token
API_BASE_URL=https://your-api-app.herokuapp.com
NEXT_PUBLIC_ENABLE_TEST_MODE=false
```

2. Run development server:
```bash
npm run dev
```

3. Visit `http://localhost:3000`

## Rollback

If a deployment has issues:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate API tokens** regularly
3. **Use environment variables** for all secrets
4. **Enable Vercel's security features**:
   - DDoS protection (automatic)
   - SSL/TLS (automatic)
   - Security headers

## Performance Optimization

1. **Enable Vercel Analytics** for monitoring
2. **Use Image Optimization**: Already configured for NHL assets
3. **Enable Edge Functions**: Automatic with Vercel
4. **Monitor Core Web Vitals** in Vercel dashboard

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic SSL
- Preview deployments

### Upgrading:
Consider upgrading if you need:
- More bandwidth
- Team collaboration features
- Advanced analytics

## Related Services

- **API Service**: Deployed on Heroku
- **DB CLI Service**: Deployed on Heroku (scheduled jobs)
- **MySQL Database**: Heroku add-on (ClearDB or JawsDB)

## Support

For issues specific to:
- **Vercel Platform**: [Vercel Support](https://vercel.com/support)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **This Application**: Check repository issues

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

