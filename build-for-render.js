const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building React app for Render deployment...');

try {
  // Create a minimal vite config for production build
  const viteConfig = `
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
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
  root: "./client",
});
`;

  fs.writeFileSync('vite.render.config.js', viteConfig);
  
  console.log('Building frontend...');
  execSync('npx vite build --config vite.render.config.js', { stdio: 'inherit' });
  
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Clean up
  fs.unlinkSync('vite.render.config.js');
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}