# PRD Structure

## 1. Problem & Vision  
StockAI helps curious investors understand daily stock movements through AI-powered explanations with transparent source attribution - eliminating confusion and building market literacy.

---

## 2. Success Metric  
≥10 GitHub stars demonstrating value as a portfolio project showcasing production-quality TypeScript development.

---

## 3. User Stories  
- As a **curious investor**, I want **to search any stock symbol** so that **I can quickly see current price and basic information**.
- As a **casual trader**, I want **AI explanations for recent price movements** so that **I understand why my stocks went up or down**.
- As a **transparency-focused user**, I want **to see data sources for each explanation** so that **I can verify and trust the information**.
- As a **learning investor**, I want **to ask follow-up questions about stocks** so that **I can deepen my understanding of market movements**.
- As a **time-conscious user**, I want **simple, jargon-free explanations** so that **I can understand market changes without complex financial knowledge**.

---

## 4. Scope (MoSCoW)  
| Must | Should | Could | Won't |
|------|--------|-------|-------|
| Stock symbol lookup with current price | Clean, responsive UI design | Real-time price updates | User authentication |
| AI-powered movement explanations | Error handling for API failures | Price alerts/notifications | Portfolio management |
| Source attribution for all data | TypeScript strict mode throughout | Historical price charts | Custom ML models |
| Basic chat interface for follow-ups | Caching for API rate limits | Advanced technical analysis | Multi-user features |
| Next.js + TypeScript foundation | Performance optimization | Dark mode theme | Mobile native app |

---

## 5. Risks & Open Questions  
- **API Rate Limits**: Alpha Vantage free tier limits may constrain usage during demo periods
- **AI Response Quality**: OpenAI explanations may be too generic or inaccurate for specific market events  
- **TypeScript Complexity**: Advanced type patterns might slow initial development velocity
- **Data Source Reliability**: Yahoo Finance API stability and accuracy for real-time data
- **Scope Creep**: Feature expansion beyond MVP could exceed 4-week timeline
- **Performance**: Multiple API calls per stock lookup may create slow user experience