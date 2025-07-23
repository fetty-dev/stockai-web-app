# Changelog

All notable changes to the StockAI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2025-07-23

### Added
- **Comprehensive Accessibility Infrastructure**: Complete WCAG 2.1 compliance tooling and framework
  - `eslint-plugin-jsx-a11y` for static accessibility analysis with recommended rules
  - `jest-axe` for automated accessibility testing in Jest test suite
  - `@axe-core/react` for real-time accessibility feedback during development
  - Custom accessibility testing utilities in `utils/test-utils.tsx`
- **Enhanced Development Scripts**: New npm scripts for accessibility workflow
  - `npm run lint:a11y` - Accessibility linting with auto-fix capabilities
  - `npm run test:a11y` - Run accessibility tests only with filtering
  - `npm run test:a11y:watch` - Watch mode for accessibility test development
- **Development Environment Integration**: Real-time accessibility monitoring
  - Webpack configuration for axe-core integration in development
  - Browser console accessibility violation reporting
  - Automatic accessibility checks during local development

### Changed  
- **ESLint Configuration**: Migrated to ESLint v9 flat config format (`eslint.config.mjs`)
- **Jest Setup**: Extended with accessibility testing matchers and utilities
- **TypeScript Support**: Added comprehensive type definitions for accessibility testing
- **AI Chat Optimization**: Improved GPT model selection and response quality
  - Upgraded to GPT-4o-mini for cost-effective, high-quality responses
  - Enhanced conversation context management and error handling
  - Removed broken web search placeholders for cleaner user experience

### Fixed
- **AI Chat Response Issues**: Resolved technical response artifacts and improved coherence
  - Eliminated exposed internal flags like "shouldSearchWeb: true"
  - Fixed JSON response parsing to provide natural conversational responses
  - Improved conversation history management for better context retention

### Infrastructure
- **Accessibility Foundation**: Established multi-layered accessibility testing approach
  - Static analysis during development (ESLint)
  - Automated testing in CI/CD pipeline (Jest + axe)
  - Real-time feedback during development (@axe-core/react)
- **Documentation Updates**: Updated project documentation to reflect accessibility improvements
- **Code Quality**: Enhanced development workflow with accessibility-first approach

## [0.3.0] - 2025-07-17

### Added
- **AI-Powered Stock Analysis**: Complete OpenAI integration with structured stock explanations
- **Interactive Chat System**: Real-time chat interface for stock-specific Q&A
- **Hybrid Data Fetching**: Multi-source API system with intelligent fallback (Finnhub → Alpha Vantage → Mock)
- **Enhanced Stock Pages**: Redesigned stock detail pages with two-column layout and integrated chat
- **New API Endpoints**: 
  - `/api/explain` - AI-powered stock explanations with educational focus
  - `/api/chat` - Interactive chat about specific stocks
- **Robust Rate Limiting**: Automatic fallback when APIs reach rate limits
- **Data Source Attribution**: Transparent indication of data sources for all responses

### Changed
- **Stock API Enhancement**: Upgraded `/api/stock` to use hybrid data fetching system
- **Frontend Architecture**: Complete redesign of stock detail pages with chart-focused layout
- **Environment Management**: Enhanced validation for multiple API keys (Finnhub, OpenAI, Alpha Vantage)
- **Error Handling**: Improved error handling across all API endpoints with proper fallbacks

### Fixed
- **API Rate Limit Issues**: Intelligent fallback prevents service interruption
- **Data Reliability**: Multiple data sources ensure consistent stock information availability

### Security
- **API Key Sanitization**: Enhanced security for logging and error handling across all services
- **Investment Disclaimers**: Appropriate risk warnings in all AI-generated content

## [0.2.0] - 2025-07-16

### Added
- Glass morphism UI design with modern aesthetic
- Stock search landing page with SearchLanding component
- Dynamic stock detail pages (`/stock/[symbol]`)
- Complete testing infrastructure with Jest and React Testing Library
- Comprehensive CI/CD pipeline with GitHub Actions
- Docker containerization (production and development)
- Environment variable validation system
- Security utilities for API key sanitization
- Pull request templates and workflow automation
- Comprehensive project documentation and ADR system

### Changed
- Replaced Dashboard component with SearchLanding for better UX
- Moved documentation files to organized docs/ structure
- Updated environment templates with current API requirements
- Improved error handling and loading states

### Fixed
- ESLint configuration compatibility issues
- Next.js build warnings and optimization
- Environment variable merge conflicts

### Security
- API key format validation and placeholder detection
- Error message sanitization to prevent key leakage
- Audit CI integration for vulnerability scanning

## [0.1.0] - 2025-07-11

### Added
- Initial Next.js 15 project setup with TypeScript strict mode
- Alpha Vantage API integration for real-time stock data
- Stock lookup API endpoint (`/api/stock`)
- TypeScript interfaces and comprehensive type definitions
- Tailwind CSS 4.0 styling foundation
- ESLint and Prettier development tools
- Basic portfolio dashboard (replaced in 0.2.0)
- Project documentation foundation (README, PRD, DESIGN, STACK)

---

## Release Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```