#!/bin/bash

# Build and deploy script for Vercel
# This script is run automatically by Vercel

echo "🔨 Building backend and frontend..."

# Install backend dependencies
cd backend
npm install
npm run build 2>/dev/null || true
cd ..

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
echo "📦 Ready for deployment"
