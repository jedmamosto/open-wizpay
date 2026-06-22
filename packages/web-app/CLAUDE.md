# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Architecture

This is a Next.js application built with TypeScript, Firebase, and Tailwind CSS for payment form management.

### Authentication System
- Firebase Authentication with session management via cookies
- `AuthContext` provides global auth state with user role/status tracking
- Token refresh mechanism runs every 10 minutes
- Protected routes check user authentication and authorization

### Data Layer
- Firebase Firestore as the primary database
- Utility functions in `/src/utils/` for CRUD operations:
  - `uploadDocument.ts` - Create documents
  - `updateDocument.ts` - Update documents
  - `queryDocument.ts` - Query single documents
  - `getCollection.ts` - Fetch collections
  - `deleteDocument.ts` - Delete documents
- Zod schemas in `/src/schemas/` for data validation

### API Structure
- RESTful API routes in `/src/app/api/`
- Key endpoints:
  - `/api/payment-forms` - CRUD operations for payment forms
  - `/api/users` - User management
  - `/api/signups` - User registration handling
  - `/api/paymongo` - Payment processing integration

### Payment Form System
- Dynamic payment forms with customizable appearance (color schemes, fonts)
- Product management within forms
- Paymongo integration for payment processing
- Webhook support for payment notifications
- Form appearance options: slate/azure/emerald/ruby/amethyst/amber color schemes with inter/playfair/nunito/work fonts

### UI Components
- Radix UI components with custom styling
- Tailwind CSS for utility-first styling
- Custom font loading (Inter, Playfair Display, Nunito, Work Sans, Geist)
- Toast notifications via Sonner
- Table components using TanStack React Table

### Configuration
- ESLint with Next.js, TypeScript, and Prettier configurations
- Prettier with Tailwind CSS and import organization plugins
- Firebase environment variables handled via Next.js config
- TypeScript with strict mode and path aliases (`@/*` maps to `./src/*`)

### Key Development Patterns
- Server components for data fetching where possible
- Client components marked with `'use client'` directive
- Custom hooks in `/src/hooks/` for reusable logic
- Form validation using Zod schemas
- Error handling with try/catch blocks and proper error responses

### Payment Verification System
- `/api/payment-verify` - Database-driven payment verification endpoint
- Stores checkout session data in Firestore when payment is initiated
- Triggers only on successful payments by intercepting Paymongo's success redirect
- No manual webhook setup required for users
- Retrieves session data from database, then verifies payment status with Paymongo API
- Uses `GET /checkout_sessions/{id}` endpoint (not listing endpoint which isn't supported)
- Triggers external webhooks (Pabbly, Zapier) then redirects to original success URL
- Customer data preserved from form submission for complete webhook payload
- Multi-tenant friendly - works with each user's own Paymongo account
- Session lookup limited to recent sessions (10 minutes) for security