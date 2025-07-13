# Design Structure

## 1. Overview
StockAI provides a simple web interface for stock lookups with AI-powered explanations. Users enter a stock symbol, receive current price data with clear explanations of recent movements, and can ask follow-up questions through a chat interface. The solution emphasizes transparency through source attribution and clean TypeScript architecture.

---

## 2. User Experience
### Primary User Flow
1. **Landing Page**: Single search input for stock symbol
2. **Stock Results**: Current price, change indicators, AI explanation
3. **Source Attribution**: Expandable section showing data sources
4. **Chat Interface**: Follow-up questions about the stock
5. **Error States**: Clear messaging for invalid symbols or API failures

### Screen States
- **Loading State**: Spinner with progress messages during API calls
- **Success State**: Stock card with price data and AI explanation
- **Error State**: User-friendly error messages with suggested actions
- **Empty State**: Helpful prompts for first-time users

### Accessibility Notes
- WCAG 2.1 AA compliance for color contrast ratios
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Focus management for modal interactions

---

## 2.1 User Interface (UI) Specs
### Visual Language
- **Colors**: 
  - Primary: Blue (#2563eb)
  - Success/Positive: Green (#059669) 
  - Error/Negative: Red (#dc2626)
  - Background: White (#ffffff)
  - Text: Gray-900 (#111827)
- **Typography**: System font stack with fallbacks
- **Spacing**: 4px, 8px, 16px, 24px, 32px scale
- **Shadows**: Subtle elevation with Tailwind shadow utilities

### Component List
- **Button**: Primary, secondary, and icon variants
- **Input**: Search field with validation states
- **Card**: Stock data container with flexible content
- **Badge**: Price change indicators and source reliability
- **Modal**: Source detail overlays
- **Chat**: Message bubbles with timestamp display

### Interaction Notes
- **Hover**: Subtle background color changes
- **Focus**: Blue ring indicators for accessibility
- **Loading**: Skeleton placeholders during data fetching
- **Validation**: Real-time feedback on form inputs

### Responsive Breakpoints
- **Mobile**: 320px - 768px (single column layout)
- **Tablet**: 768px - 1024px (two column layout)
- **Desktop**: 1024px+ (three column layout with sidebar)

### Accessibility
- **Color Contrast**: 4.5:1 minimum ratio for text
- **Focus Order**: Logical tab sequence through interface
- **Screen Readers**: Comprehensive aria-label coverage
- **Keyboard Navigation**: All functions accessible without mouse

---

## 3. System Architecture
### Context Diagram
```
User → Next.js Frontend → API Routes → External APIs
                      ↓
                   TypeScript Types
                      ↓
                 Component Library
```

### Component Responsibilities
- **Page Components**: Route-level components handling data fetching
- **UI Components**: Reusable interface elements with TypeScript props
- **API Routes**: Server-side endpoints with validation and error handling
- **Utility Functions**: Type-safe wrappers for external API integration
- **Type Definitions**: Comprehensive interfaces for all data structures

### Data Models
```typescript
// Core stock data structure
interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

// Source attribution for transparency
interface SourceAttribution {
  source: 'alpha_vantage' | 'openai_knowledge' | 'market_context';
  description: string;
  reliability: 'high' | 'medium' | 'low';
  url?: string;
}

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  sources: SourceAttribution[];
}
```

### Sequence Diagram for Main Use-Case
1. User enters stock symbol in search field
2. Frontend validates symbol format client-side
3. API call to `/api/stock?symbol=AAPL`
4. Server fetches data from Alpha Vantage API
5. Server validates and transforms response
6. Client receives typed stock data
7. AI explanation generated via OpenAI integration
8. Source attribution displayed with results
9. Chat interface enabled for follow-up questions

---

## 4. Non-Functional Requirements
### Performance Targets
- **Page Load**: < 2 seconds initial load time
- **API Response**: < 3 seconds for stock lookup + AI explanation
- **Interaction**: < 100ms for UI state changes
- **Bundle Size**: < 500KB total JavaScript payload

### Scalability Notes
- Client-side caching for repeated stock lookups
- Rate limiting consideration for API quotas
- Stateless design for horizontal scaling potential
- CDN-friendly static asset optimization

### Security Basics
- API key protection via environment variables
- Input validation and sanitization for all user data
- No sensitive data stored in client-side code
- HTTPS enforcement for all API communications

---

## 5. Trade-offs Considered
### Next.js vs Create React App
**Chosen**: Next.js for built-in API routes, TypeScript support, and deployment optimization
**Rejected**: CRA due to additional complexity for API integration

### Alpha Vantage vs Yahoo Finance API
**Chosen**: Alpha Vantage for reliable free tier and comprehensive documentation
**Rejected**: Yahoo Finance due to unofficial API status and rate limiting concerns

### Client vs Server-side AI Integration
**Chosen**: Server-side for API key security and response consistency
**Rejected**: Client-side due to security risks and performance implications

### TypeScript Strict Mode vs Gradual Adoption
**Chosen**: Strict mode from start for portfolio demonstration value
**Rejected**: Gradual adoption to showcase advanced TypeScript patterns

---

## 6. Open Questions
- **AI Response Caching**: How long should explanations be cached before regeneration?
- **Error Recovery**: Should failed API calls retry automatically or require user action?
- **Data Refresh**: What's the optimal frequency for real-time price updates?
- **Internationalization**: Should the interface support multiple languages for broader appeal?
- **Mobile UX**: Do we need native mobile app features or is responsive web sufficient?
- **Analytics**: What user interaction data should be collected for improvement insights?