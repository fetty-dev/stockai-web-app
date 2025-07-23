# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm run dev` - Start Next.js development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server

### Code Quality & Testing
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript compiler without emitting files
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Environment & Validation
- `npm run validate-env` - Validate required environment variables (Alpha Vantage API key)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router (app directory structure)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.0 with PostCSS
- **Testing**: Jest with Testing Library for React components
- **Data Source**: Alpha Vantage API for stock data

### Project Structure
```
app/
├── api/stock/route.ts          # Stock data API endpoint
├── stock/[symbol]/page.tsx     # Dynamic stock detail pages  
├── layout.tsx                  # Root layout with Inter font
└── page.tsx                    # Homepage with SearchLanding

components/
└── SearchLanding.tsx           # Main search interface component

utils/
├── alpha-vantage.ts           # Alpha Vantage API client with error handling
└── env.ts                     # Environment variable validation & security

types/
└── index.ts                   # TypeScript interfaces for stock data & API responses
```

### Key Architectural Patterns

**API Layer**: Centralized in `app/api/stock/route.ts` with standardized error handling and source attribution. All API responses follow the `ApiResponse<T>` interface pattern with success/error states and source tracking.

**Error Handling**: Custom error classes (`AlphaVantageError`, `EnvironmentError`) provide specific error types. API key sanitization prevents sensitive data leakage in logs.

**Type Safety**: Comprehensive TypeScript interfaces in `types/index.ts` define contracts between components, APIs, and external services. Alpha Vantage raw response types are transformed to standardized `StockData` interface.

**Environment Security**: `utils/env.ts` provides secure environment variable access with validation patterns to prevent placeholder values and ensure API key format compliance.

**Component Architecture**: React components use Next.js App Router patterns. `SearchLanding` handles form state and navigation, while stock detail pages are generated dynamically via `[symbol]` route parameters.

**Testing Setup**: Jest configuration supports Next.js app directory structure with module path mapping (`@/` alias) and comprehensive coverage collection across app, components, and utils directories.

## Environment Variables Required

- `ALPHA_VANTAGE_API_KEY` - Stock data API key (get from alphavantage.co)  
- `NODE_ENV` - Application environment (development/production/test)

Use `npm run validate-env` to verify environment setup before development.

## Important Development Notes

- API responses include source attribution for data transparency
- Stock symbols are validated (1-5 uppercase letters) before API calls
- All sensitive data is sanitized in error messages and logs
- Component styling uses inline styles with glassmorphism design patterns
- TypeScript strict mode is enabled - ensure proper type annotations
- Jest tests should be placed in `__tests__` directories or use `.test.ts` suffix