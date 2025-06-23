#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Starting Render build process...');

try {
  // Build frontend with direct path to vite
  console.log('📦 Building frontend...');
  execSync('./node_modules/.bin/vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Build backend with direct path to esbuild
  console.log('⚙️ Building backend...');
  execSync('./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}