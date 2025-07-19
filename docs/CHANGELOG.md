# Changelog

All notable changes to the StockAI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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