# Changelog

All notable changes to the StockAI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Planned AI explanation features (Issue #13-15)
- Chat interface development (Issue #19-22)
- Request quota system (Issue #17)

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