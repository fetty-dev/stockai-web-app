# TypeScript Architecture - StockAI Simplified

## Overview

This document outlines the TypeScript architecture for StockAI, focusing on type safety, maintainability, and portfolio demonstration of advanced TypeScript features.

---

## Type System Design

### Core Data Types

```typescript
// types/stock.ts
export interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface StockQuote extends StockData {
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

// Union type for different data sources
export type DataSource = 'yahoo_finance' | 'openai_knowledge' | 'market_context';

export interface SourceAttribution {
  source: DataSource;
  description: string;
  reliability: 'high' | 'medium' | 'low';
  url?: string;
}

// Generic response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  sources: SourceAttribution[];
}
```

### AI and Chat Types

```typescript
// types/chat.ts
export interface ChatMessage<T = string> {
  id: string;
  role: 'user' | 'assistant';
  content: T;
  timestamp: Date;
  sources?: SourceAttribution[];
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: {
    currentStock?: string;
    userPreferences?: UserPreferences;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Discriminated union for different AI responses
export type AIResponse = 
  | { type: 'stock_explanation'; content: string; stockSymbol: string }
  | { type: 'follow_up'; content: string; relatedTopic: string }
  | { type: 'error'; content: string; errorCode: string };

export interface UserPreferences {
  explanationStyle: 'simple' | 'detailed' | 'technical';
  showSources: boolean;
  preferredTopics: string[];
}
```

### API Integration Types

```typescript
// types/api.ts
export interface YahooFinanceResponse {
  quoteResponse: {
    result: Array<{
      symbol: string;
      regularMarketPrice: number;
      regularMarketChange: number;
      regularMarketChangePercent: number;
      regularMarketVolume: number;
      marketCap: number;
      shortName: string;
      regularMarketDayHigh: number;
      regularMarketDayLow: number;
      fiftyTwoWeekHigh: number;
      fiftyTwoWeekLow: number;
    }>;
    error: null | string;
  };
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: 'assistant';
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Type guards for runtime validation
export function isValidStockSymbol(symbol: unknown): symbol is string {
  return typeof symbol === 'string' && 
         /^[A-Z]{1,5}$/.test(symbol);
}

export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return typeof obj === 'object' && 
         obj !== null && 
         'data' in obj && 
         'success' in obj;
}
```

---

## Component Architecture

### Generic Components

```typescript
// components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}

// components/ui/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

### Stock-Specific Components

```typescript
// components/StockCard.tsx
interface StockCardProps {
  stock: StockData;
  explanation?: string;
  sources?: SourceAttribution[];
  loading?: boolean;
  onSourceClick?: (source: SourceAttribution) => void;
}

export function StockCard({ 
  stock, 
  explanation, 
  sources = [], 
  loading = false,
  onSourceClick 
}: StockCardProps) {
  const priceChangeColor = stock.change >= 0 ? 'text-green-600' : 'text-red-600';
  const priceChangeIcon = stock.change >= 0 ? '↗' : '↘';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{stock.symbol}</h1>
          <p className="text-gray-600">{stock.companyName}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">${stock.price.toFixed(2)}</div>
          <div className={`text-lg ${priceChangeColor}`}>
            {priceChangeIcon} {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Getting AI explanation..." />}
      
      {explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">AI Explanation:</h3>
          <p className="text-gray-800">{explanation}</p>
        </div>
      )}

      {sources.length > 0 && (
        <SourceList sources={sources} onSourceClick={onSourceClick} />
      )}
    </div>
  );
}

// components/SourceList.tsx
interface SourceListProps {
  sources: SourceAttribution[];
  onSourceClick?: (source: SourceAttribution) => void;
}

export function SourceList({ sources, onSourceClick }: SourceListProps) {
  const getReliabilityColor = (reliability: SourceAttribution['reliability']) => {
    switch (reliability) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="font-semibold mb-2">Sources:</h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <button
            key={index}
            onClick={() => onSourceClick?.(source)}
            className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded"
          >
            <span className="text-sm">{source.description}</span>
            <span className={`text-xs ${getReliabilityColor(source.reliability)}`}>
              {source.reliability}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Chat Components

```typescript
// components/ChatBox.tsx
interface ChatBoxProps {
  session: ChatSession;
  onSendMessage: (message: string) => Promise<void>;
  loading?: boolean;
}

export function ChatBox({ session, onSendMessage, loading = false }: ChatBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <LoadingSpinner size="small" message="AI is thinking..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this stock..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// components/ChatMessage.tsx
interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const bgColor = isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900';
  const alignment = isUser ? 'ml-auto' : 'mr-auto';

  return (
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bgColor} ${alignment}`}>
      <p className="text-sm">{message.content}</p>
      <div className="text-xs opacity-70 mt-1">
        {message.timestamp.toLocaleTimeString()}
      </div>
      {message.sources && message.sources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-opacity-20">
          <p className="text-xs">Sources: {message.sources.length}</p>
        </div>
      )}
    </div>
  );
}
```

---

## API Route Architecture

### Stock Data API

```typescript
// app/api/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockDataSchema } from '@/lib/validations';
import { fetchStockData } from '@/utils/yahoo-finance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol || !isValidStockSymbol(symbol)) {
      return NextResponse.json(
        { error: 'Invalid stock symbol' },
        { status: 400 }
      );
    }

    const stockData = await fetchStockData(symbol);
    
    // Validate response with Zod
    const validatedData = stockDataSchema.parse(stockData);

    const response: ApiResponse<StockData> = {
      data: validatedData,
      success: true,
      sources: [
        {
          source: 'yahoo_finance',
          description: 'Yahoo Finance API',
          reliability: 'high'
        }
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock data',
        success: false,
        sources: []
      },
      { status: 500 }
    );
  }
}
```

### AI Explanation API

```typescript
// app/api/explain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateExplanation } from '@/utils/openai';
import { isValidStockSymbol } from '@/types/api';

interface ExplanationRequest {
  symbol: string;
  stockData: StockData;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExplanationRequest = await request.json();
    
    if (!isValidStockSymbol(body.symbol)) {
      return NextResponse.json(
        { error: 'Invalid stock symbol' },
        { status: 400 }
      );
    }

    const explanation = await generateExplanation(body.symbol, body.stockData, body.context);

    const response: ApiResponse<string> = {
      data: explanation,
      success: true,
      sources: [
        {
          source: 'openai_knowledge',
          description: 'OpenAI GPT Analysis',
          reliability: 'medium'
        },
        {
          source: 'market_context',
          description: 'General Market Knowledge',
          reliability: 'medium'
        }
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Explanation API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate explanation',
        success: false,
        sources: []
      },
      { status: 500 }
    );
  }
}
```

---

## Utility Functions

### Type-Safe API Wrappers

```typescript
// utils/yahoo-finance.ts
import { YahooFinanceResponse, StockData } from '@/types/api';

export async function fetchStockData(symbol: string): Promise<StockData> {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
  );

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.statusText}`);
  }

  const data: YahooFinanceResponse = await response.json();
  
  if (data.quoteResponse.error) {
    throw new Error(data.quoteResponse.error);
  }

  const quote = data.quoteResponse.result[0];
  if (!quote) {
    throw new Error('No data found for symbol');
  }

  return {
    symbol: quote.symbol,
    companyName: quote.shortName,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    volume: quote.regularMarketVolume,
    marketCap: quote.marketCap,
    lastUpdated: new Date()
  };
}

// utils/openai.ts
export async function generateExplanation(
  symbol: string,
  stockData: StockData,
  context?: string
): Promise<string> {
  const prompt = `
    Explain why ${symbol} (${stockData.companyName}) moved ${stockData.changePercent.toFixed(2)}% today.
    Current price: $${stockData.price.toFixed(2)}
    Change: ${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)
    ${context ? `Additional context: ${context}` : ''}
    
    Provide a clear, concise explanation suitable for a casual investor.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful financial assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data: OpenAIResponse = await response.json();
  return data.choices[0].message.content;
}
```

---

## Validation Schema

```typescript
// lib/validations.ts
import { z } from 'zod';

export const stockDataSchema = z.object({
  symbol: z.string().min(1).max(5),
  companyName: z.string().min(1),
  price: z.number().positive(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().nonnegative(),
  marketCap: z.number().positive(),
  lastUpdated: z.date()
});

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.date(),
  sources: z.array(z.object({
    source: z.enum(['yahoo_finance', 'openai_knowledge', 'market_context']),
    description: z.string(),
    reliability: z.enum(['high', 'medium', 'low']),
    url: z.string().url().optional()
  })).optional()
});

export type StockDataInput = z.infer<typeof stockDataSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
```

This TypeScript architecture provides:
- **Strong typing** throughout the application
- **Generic components** for reusability
- **Type guards** for runtime safety
- **API integration** with proper error handling
- **Validation** using Zod schemas
- **Clear separation** between types, components, and utilities

The architecture showcases advanced TypeScript features while maintaining simplicity and maintainability.