# Emparo Peri Peri Restaurant Website

## Overview

This is a full-stack web application for Emparo Peri Peri, an authentic peri peri restaurant located in Finsbury Park, London. The application serves as the restaurant's digital presence, showcasing their menu, allowing customers to view offerings, and providing contact information for orders.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Emparo brand colors
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: Turso SQLite with Drizzle ORM
- **Schema**: Defined in shared/schema.ts using Drizzle SQLite syntax
- **Session Management**: Configured for connect-pg-simple (can be adapted for SQLite)

### Data Storage
- **Primary Database**: Turso SQLite (configured via DATABASE_URL and DATABASE_AUTH_TOKEN)
- **ORM**: Drizzle ORM with LibSQL adapter
- **Schema Design**: 
  - Users table for authentication
  - Menu items table for restaurant offerings
  - Orders table for customer orders
  - Gallery table for restaurant images
- **Storage Strategy**: Memory storage for development, Turso for production
- **Migration Management**: Drizzle Kit for database migrations

## Key Components

### Frontend Components
- **Navigation**: Fixed header with smooth scrolling navigation
- **Hero Section**: Landing area with call-to-action buttons
- **Menu Sections**: Organized display of food categories and items
- **Gallery**: Image showcase of restaurant offerings
- **Contact Form**: Customer inquiry and contact information
- **Order System**: Basic order form structure (not fully implemented)

### Backend Services
- **Storage Interface**: Abstracted storage layer with both memory and database implementations
- **API Routes**: RESTful endpoints (framework set up, routes to be implemented)
- **Static Assets**: Serving attached restaurant images and assets

### UI Design System
- **Color Scheme**: Custom Emparo brand colors (orange, red, yellow, dark brown)
- **Typography**: Poppins font family for modern, clean appearance
- **Components**: Consistent use of shadcn/ui components with custom styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Data Flow

1. **Static Content**: Restaurant information, menu items, and images served directly
2. **Dynamic Content**: User interactions handled via React Query
3. **Navigation**: Client-side routing with smooth scrolling to sections
4. **Assets**: Images stored in attached_assets directory and served statically
5. **Forms**: Contact and order forms ready for backend integration

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Radix UI components for accessible UI primitives
- Tailwind CSS for utility-first styling
- Lucide React for icons
- React Query for state management
- Form handling with React Hook Form

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- Turso SQLite client library (@libsql/client)
- Session management (connect-pg-simple)
- Development tools (tsx, esbuild)

### Development Tools
- Vite for development server and bundling
- TypeScript for type safety
- ESLint and Prettier configuration
- Replit-specific development plugins

## Development Environment
- **Hot Reload**: Vite HMR for frontend development
- **API Development**: Express server with automatic restart
- **Database**: Drizzle migrations for schema management

## Render Deployment Configuration

### Server Configuration
- **Port**: Uses `process.env.PORT` (Render's dynamic port) with fallback to 5000
- **Environment**: Automatically switches to TursoStorage when DATABASE_URL is available
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### Required Environment Variables
- `NODE_ENV=production`
- `DATABASE_URL` - Turso database URL (libsql://...)
- `DATABASE_AUTH_TOKEN` - Turso authentication token

### Deployment Files
- `render.yaml` - Render service configuration
- Build process creates production bundle with Vite + ESBuild

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Switched database from PostgreSQL to Turso SQLite
- July 03, 2025. Configured for Render deployment with dynamic port and Turso integration
- July 04, 2025. Successfully deployed to Render at https://empareperiperi.onrender.com
- July 04, 2025. Resolved build issues by updating Render build command to include devDependencies
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```