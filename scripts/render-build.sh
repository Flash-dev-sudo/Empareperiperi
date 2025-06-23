#!/bin/bash
set -e

echo "Starting Render build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend using direct path
echo "Building frontend..."
if [ -x "./node_modules/.bin/vite" ]; then
    ./node_modules/.bin/vite build
else
    echo "Error: Vite not found in node_modules/.bin/"
    exit 1
fi

# Build backend using direct path
echo "Building backend..."
if [ -x "./node_modules/.bin/esbuild" ]; then
    ./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
else
    echo "Error: ESBuild not found in node_modules/.bin/"
    exit 1
fi

echo "Build completed successfully!"