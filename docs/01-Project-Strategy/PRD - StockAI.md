# StockAI Simplified - Product Requirements Document

## Project Vision

**Mission:** Create a simple, TypeScript-powered web application that explains stock movements using AI with clear source attribution.

**Target:** Portfolio project that demonstrates modern TypeScript development skills while solving a real user problem.

**Core Value Proposition:** "Get AI explanations for stock movements with source links - no complexity, just clarity."

---

## Target Users

**Primary User: The Curious Investor**
- Age: 22-35, casual investor
- Has some stocks but confused by daily movements
- Wants quick, simple explanations
- Values transparency about information sources
- Prefers simple tools over complex dashboards

**User Journey:**
1. "Why did my stock drop today?"
2. Opens StockAI, enters stock symbol
3. Gets current price + AI explanation with sources
4. Asks follow-up questions via chat
5. Understands the movement, feels informed

---

## Core Features (MVP)

### 1. Stock Lookup & AI Explanation
**What:** Enter stock symbol, get current price + AI explanation
**Why:** Immediate value, solves core user problem
**TypeScript Showcase:** Strong typing for stock data, API responses

```typescript
interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  explanation: string;
  sources: string[];
}
```

### 2. Simple Source Attribution
**What:** Show which data sources AI used for explanation
**Why:** Builds trust, differentiates from generic AI
**TypeScript Showcase:** Union types, discriminated unions

```typescript
type DataSource = 'yahoo_finance' | 'openai_knowledge' | 'market_context';

interface SourceAttribution {
  source: DataSource;
  description: string;
  reliability: 'high' | 'medium' | 'low';
}
```

### 3. Basic Chat Interface
**What:** Ask follow-up questions about the stock
**Why:** Natural interaction, deeper engagement
**TypeScript Showcase:** Generic types, async/await patterns

```typescript
interface ChatMessage<T = string> {
  id: string;
  role: 'user' | 'assistant';
  content: T;
  timestamp: Date;
  sources?: SourceAttribution[];
}
```

---

## Technical Architecture

### Core Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Rapid UI development
- **OpenAI API** - AI explanations
- **Yahoo Finance API** - Stock data

### TypeScript Features Showcased
- **Strict typing** for all API responses
- **Generic components** for reusable UI
- **Discriminated unions** for different data types
- **Async/await** with proper error handling
- **Interface composition** for complex data structures

### Project Structure
```
stockai-simple/
├── app/
│   ├── page.tsx              # Main stock lookup page
│   ├── api/
│   │   ├── stock/route.ts    # Yahoo Finance integration
│   │   └── explain/route.ts  # OpenAI integration
├── components/
│   ├── StockCard.tsx         # Display stock info
│   ├── ChatBox.tsx           # Simple chat interface
│   └── SourceList.tsx        # Source attribution
├── types/
│   ├── stock.ts              # Stock data interfaces
│   ├── chat.ts               # Chat interfaces
│   └── api.ts                # API response types
├── utils/
│   ├── yahoo-finance.ts      # API wrapper
│   └── openai.ts             # AI integration
└── lib/
    └── validations.ts        # Zod schemas
```

---

## Implementation Timeline

### Week 1: Foundation
- Next.js + TypeScript setup
- Stock lookup form
- Yahoo Finance API integration
- Basic TypeScript interfaces

### Week 2: AI Integration
- OpenAI API setup
- Explanation generation
- Source attribution
- Error handling

### Week 3: Chat Interface
- Simple chat component
- Context awareness
- Message history
- TypeScript generics

### Week 4: Polish & Deploy
- UI improvements
- Better error messages
- Performance optimization
- Deploy to Vercel

---

## Success Metrics

### Technical Metrics
- **TypeScript Coverage:** 100% (no `any` types)
- **Type Safety:** All API responses strictly typed
- **Performance:** < 2s response time for explanations
- **Error Handling:** Graceful degradation for API failures

### User Metrics
- **Usability:** Single-step stock lookup
- **Clarity:** AI explanations understandable to target users
- **Trust:** Source attribution for all claims
- **Engagement:** Users ask follow-up questions

### Portfolio Metrics
- **Code Quality:** Clean, well-typed TypeScript
- **Architecture:** Scalable component design
- **Documentation:** Clear README and code comments
- **Deployment:** Live, working application

---

## Non-Goals (Out of Scope)

- ❌ User authentication
- ❌ Portfolio management
- ❌ Real-time data updates
- ❌ Custom ML models
- ❌ Complex database
- ❌ Multi-user features
- ❌ Mobile app
- ❌ Advanced analytics

---

## Risk Mitigation

### Technical Risks
- **API Rate Limits:** Implement caching and usage limits
- **TypeScript Complexity:** Start simple, add complexity gradually
- **AI Response Quality:** Careful prompt engineering and testing

### Scope Risks
- **Feature Creep:** Stick to 3 core features
- **Over-Engineering:** Prioritize working software over perfect architecture
- **Time Management:** 4-week hard deadline

---

## Portfolio Value

### TypeScript Demonstration
- **Advanced Types:** Generics, unions, intersections
- **API Integration:** Strongly typed external API consumption
- **Error Handling:** Type-safe error management
- **Component Design:** Reusable, well-typed React components

### Development Process
- **Iterative Development:** Working software each week
- **Problem Solving:** Real user problem with simple solution
- **Technical Decisions:** Clear reasoning for architecture choices
- **Deployment:** Production-ready application

This simplified approach showcases TypeScript skills while building something achievable and valuable.