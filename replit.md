# Emparo Peri Peri Restaurant Website

## Overview

A full-stack restaurant website for Emparo Peri Peri, featuring an authentic peri peri chicken and pizza menu with online ordering capabilities. The application is built as a modern React frontend with Express.js backend, using Turso (LibSQL) as the database solution and deployed on Render.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom color variables for brand consistency
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture

- **Runtime**: Node.js 20
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints for menu items, orders, and gallery
- **Middleware**: Custom logging, JSON parsing, and static file serving

### Database Schema

- **Database**: Turso (LibSQL) - distributed SQLite database
- **Tables**:
  - `users`: User authentication (username, password)
  - `menu_items`: Restaurant menu (name, category, price, description, image, spice level)
  - `orders`: Customer orders (contact info, items, status, delivery details)
  - `gallery`: Restaurant photo gallery (title, image URL, category)

## Key Components

### Frontend Components

1. **Navigation**: Responsive navigation with scroll-based section highlighting
2. **Hero Section**: Dynamic text rotation and call-to-action buttons
3. **Menu Showcase**: Visual menu presentation with categorized items
4. **Order System**: Customer order form with validation
5. **Gallery**: Image showcase with interactive elements
6. **Contact/About**: Business information and location details

### Backend Services

1. **Storage Layer**: Database abstraction with TypeScript interfaces
2. **API Routes**: CRUD operations for menu, orders, and gallery
3. **Static Assets**: Serving restaurant images and media files
4. **Development Tools**: Hot reloading and error overlay in development

## Data Flow

1. **Menu Display**: Frontend fetches menu data from `/api/menu` endpoint
2. **Order Processing**: Customer orders submitted to `/api/orders` with validation
3. **Image Assets**: Static images served from `/attached_assets` directory
4. **Real-time Updates**: TanStack Query provides caching and background refetching

## External Dependencies

### Database
- **Turso Database**: Cloud-hosted LibSQL database
- **Connection**: Authenticated via JWT token
- **URL**: `libsql://emparo-periperi-flash.aws-eu-west-1.turso.io`

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Poppins font family for typography

### Development Tools
- **Replit Integration**: Development environment support
- **TypeScript**: Type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Assets**: Static files copied to deployment directory

### Render Deployment
- **Platform**: Render.com for hosting
- **Build Command**: Custom build script combining frontend and backend
- **Environment Variables**: Database credentials and production settings
- **Health Check**: Root endpoint for service monitoring

### Production Configuration
- **Node Environment**: Production mode with optimizations
- **Database**: Turso production instance
- **Static Serving**: Express serves built React app
- **Port**: Dynamic port assignment (default 5000)

## Changelog
- June 23, 2025: Initial setup
- June 24, 2025: Fixed vite.config.ts top-level await issue, both local development and Render deployment working

## User Preferences

Preferred communication style: Simple, everyday language.