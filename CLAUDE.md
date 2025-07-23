# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm run dev` - Start Next.js development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server

### Code Quality & Testing
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:a11y` - Run accessibility linting with auto-fix  
- `npm run type-check` - Run TypeScript compiler without emitting files
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:a11y` - Run accessibility tests only
- `npm run test:a11y:watch` - Watch mode for accessibility tests

### Environment & Validation
- `npm run validate-env` - Validate required environment variables (Alpha Vantage, OpenAI API keys)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router (app directory structure)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.0 with PostCSS
- **Testing**: Jest with Testing Library for React components + jest-axe for accessibility
- **Accessibility**: ESLint jsx-a11y plugin + @axe-core/react for development feedback
- **AI Integration**: OpenAI GPT-4o-mini for stock analysis and chat
- **Data Sources**: Hybrid system (Finnhub → Alpha Vantage → Mock data fallback)

### Project Structure
```
app/
├── api/
│   ├── chat/route.ts           # AI chat API endpoint
│   ├── explain/route.ts        # AI stock explanation API endpoint
│   └── stock/route.ts          # Stock data API endpoint (hybrid data fetching)
├── stock/[symbol]/page.tsx     # Dynamic stock detail pages with AI chat
├── layout.tsx                  # Root layout with Inter font
└── page.tsx                    # Homepage with SearchLanding

components/
├── SearchLanding.tsx           # Main search interface component
└── StockChart.tsx             # Stock chart visualization component

utils/
├── alpha-vantage.ts           # Alpha Vantage API client with fallback
├── env.ts                     # Environment variable validation & security
├── finnhub.ts                 # Finnhub API client
├── hybrid-stock-api.ts        # Multi-source stock data fetching
├── openai.ts                  # OpenAI integration for AI explanations
├── axe-setup.js               # Accessibility monitoring for development
└── test-utils.tsx             # Testing utilities with accessibility support

types/
└── index.ts                   # TypeScript interfaces for stock data & API responses
```

### Key Architectural Patterns

**API Layer**: Centralized in `app/api/stock/route.ts` with standardized error handling and source attribution. All API responses follow the `ApiResponse<T>` interface pattern with success/error states and source tracking.

**Error Handling**: Custom error classes (`AlphaVantageError`, `EnvironmentError`) provide specific error types. API key sanitization prevents sensitive data leakage in logs.

**Type Safety**: Comprehensive TypeScript interfaces in `types/index.ts` define contracts between components, APIs, and external services. Alpha Vantage raw response types are transformed to standardized `StockData` interface.

**Environment Security**: `utils/env.ts` provides secure environment variable access with validation patterns to prevent placeholder values and ensure API key format compliance.

**Component Architecture**: React components use Next.js App Router patterns. `SearchLanding` handles form state and navigation, while stock detail pages are generated dynamically via `[symbol]` route parameters.

**Testing Setup**: Jest configuration supports Next.js app directory structure with module path mapping (`@/` alias), comprehensive coverage collection, and accessibility testing with jest-axe integration.

**Accessibility Architecture**: Multi-layered accessibility approach with ESLint static analysis (jsx-a11y), automated testing (jest-axe), and development-time feedback (@axe-core/react) ensures WCAG 2.1 compliance.

## Environment Variables Required

- `ALPHA_VANTAGE_API_KEY` - Stock data API key (get from alphavantage.co)
- `OPENAI_API_KEY` - OpenAI API key for AI explanations and chat (required)
- `FINNHUB_API_KEY` - Finnhub API key for enhanced stock data (optional)
- `NODE_ENV` - Application environment (development/production/test)

Use `npm run validate-env` to verify environment setup before development.

## Important Development Notes

- **API Architecture**: Hybrid data fetching system with intelligent fallback (Finnhub → Alpha Vantage → Mock)
- **AI Integration**: GPT-4o-mini provides stock explanations and interactive chat capabilities
- **Accessibility**: WCAG 2.1 compliance with automated testing and development feedback
- **Source Attribution**: All API responses include transparent source attribution for data reliability
- **Security**: API key validation, sanitization in logs, and environment variable protection
- **Data Validation**: Stock symbols validated (1-5 uppercase letters) with comprehensive error handling
- **Styling**: Glassmorphism design with inline styles and Tailwind CSS utilities
- **Testing**: Accessibility tests should include 'accessibility' in test name for filtering
- **Development**: Real-time accessibility feedback enabled in development environment