#!/bin/bash

# Cloudflare Pages Setup Script for DeepFold Frontend
# This script helps you set up and deploy to Cloudflare Pages

set -e

echo "🚀 DeepFold - Cloudflare Pages Setup"
echo "===================================="
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    pnpm add -g wrangler
    echo "✅ Wrangler installed successfully"
else
    echo "✅ Wrangler is already installed"
fi

# Check if logged in to Cloudflare
echo ""
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please login to Cloudflare:"
    wrangler login
else
    echo "✅ Already logged in to Cloudflare"
    wrangler whoami
fi

echo ""
echo "📋 Setup Options:"
echo "1. Build and deploy to Cloudflare Pages"
echo "2. Create new Cloudflare Pages project"
echo "3. Set environment variables"
echo "4. View deployment logs"
echo "5. Exit"
echo ""

read -p "Select an option (1-5): " option

case $option in
    1)
        echo ""
        echo "🏗️  Building application..."
        pnpm install
        pnpm run build
        
        echo ""
        echo "🚀 Deploying to Cloudflare Pages..."
        wrangler pages deploy out --project-name=deepfold-marketplace
        
        echo ""
        echo "✅ Deployment complete!"
        ;;
    2)
        echo ""
        read -p "Enter project name (default: deepfold-marketplace): " project_name
        project_name=${project_name:-deepfold-marketplace}
        
        echo "Creating Cloudflare Pages project: $project_name"
        wrangler pages project create "$project_name"
        
        echo "✅ Project created successfully!"
        ;;
    3)
        echo ""
        echo "Setting environment variables..."
        read -p "Enter your API URL (e.g., https://api.deepfold.com): " api_url
        
        wrangler pages deployment create production \
            --env NEXT_PUBLIC_API_URL="$api_url"
        
        echo "✅ Environment variables set!"
        ;;
    4)
        echo ""
        echo "📜 Recent deployments:"
        wrangler pages deployment list
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Useful commands:"
echo "  pnpm cf:build       - Build and deploy"
echo "  pnpm cf:deploy      - Deploy existing build"
echo "  pnpm cf:dev         - Run Cloudflare Pages dev server"
echo "  wrangler pages deployment list - View deployments"
echo ""
echo "📖 Documentation: See CLOUDFLARE-DEPLOYMENT.md for more info"
