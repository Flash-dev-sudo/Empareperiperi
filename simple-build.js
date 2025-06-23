#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Create a minimal vite config that works
const minimalConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
});
`;

try {
  console.log('Creating minimal config...');
  writeFileSync('vite.minimal.config.js', minimalConfig);
  
  console.log('Building frontend...');
  execSync('npx vite build --config vite.minimal.config.js', { stdio: 'inherit' });
  
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}