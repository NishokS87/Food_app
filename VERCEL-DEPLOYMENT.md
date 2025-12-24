# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create a Vercel account at https://vercel.com

## Option 1: Deploy Frontend Only (Quick Start)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel
```

### Step 4: Set Environment Variable
After deployment, go to your Vercel dashboard:
1. Select your project
2. Go to Settings → Environment Variables
3. Add: `REACT_APP_API_URL` = `http://your-backend-url:3000/api`

### Note:
- Your backend services need to be running on a server accessible from the internet
- You can use Railway, Render, or Heroku for backend hosting

## Option 2: Deploy via GitHub (Recommended)

### Step 1: Connect Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository: `NishokS87/Food_app`
3. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 2: Add Environment Variables
In Vercel dashboard, add:
- `REACT_APP_API_URL` = `http://your-backend-url:3000/api`

### Step 3: Deploy
Click "Deploy" button

## Backend Deployment Options

### Option A: Railway (Free tier available)
1. Go to https://railway.app
2. Connect GitHub repository
3. Deploy each service separately:
   - Backend API Server (Port 3000)
   - Gateway Server (Port 8001)
   - Restaurant Service (Port 5001, 5002)
   - Order Service (Port 6001, 6002)

### Option B: Render (Free tier available)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Deploy services

### Option C: Keep Backend Local
- Use ngrok to expose local backend: `ngrok http 3000`
- Use ngrok URL as `REACT_APP_API_URL`

## Quick Deploy Commands

### Deploy Frontend to Vercel
```bash
cd c:\Download\food_app\food-delivery-app
vercel --prod
```

### Deploy with specific directory
```bash
vercel --prod --cwd frontend
```

## Automatic Deployments
Once connected to GitHub, Vercel automatically deploys:
- **Production**: On push to `main` branch
- **Preview**: On pull requests

## Current Project Structure
```
food-delivery-app/
├── frontend/           # Deploy to Vercel
├── backend-api-server/ # Deploy to Railway/Render
├── backend-gateway-server/ # Deploy to Railway/Render
└── services/
    ├── restaurant-service/ # Deploy to Railway/Render
    └── order-service/      # Deploy to Railway/Render
```

## Post-Deployment
1. Update CORS settings in backend services to allow Vercel domain
2. Update API URL in frontend environment variables
3. Test all endpoints

## Useful Commands
- `vercel`: Deploy to preview
- `vercel --prod`: Deploy to production
- `vercel ls`: List deployments
- `vercel logs`: View logs
- `vercel env add`: Add environment variable
