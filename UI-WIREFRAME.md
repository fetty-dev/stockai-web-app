# StockAI UI/UX Wireframe & Layout Design

## 🎯 Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
│  [StockAI Logo]                          [Theme Toggle]     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SEARCH SECTION                         │
│                                                             │
│            🔍 [Enter stock symbol (e.g., AAPL)]            │
│                        [Search Button]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    RESULTS SECTION                         │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │     STOCK CARD      │  │        CHAT BOX            │   │
│  │                     │  │                             │   │
│  │  AAPL - Apple Inc   │  │  💬 Ask questions about    │   │
│  │  $212.41  +1.27     │  │     this stock...           │   │
│  │  (+0.60%) ↗️         │  │                             │   │
│  │                     │  │  [Chat interface]           │   │
│  │  Volume: 44.4M      │  │                             │   │
│  │  Market Cap: $3.2T  │  │                             │   │
│  │                     │  │                             │   │
│  │  📊 [View Details]  │  │  [Message input field]     │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       FOOTER                               │
│              Powered by Alpha Vantage & OpenAI             │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Search Interface Design

### **Stock Symbol Input**
- **Label**: "Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
- **Input Type**: Text, auto-uppercase, 1-5 characters
- **Validation**: Real-time symbol format checking
- **Placeholder**: "AAPL"
- **Button**: "Search Stock" with loading spinner

### **Search States**
- **Default**: Empty input, ready for typing
- **Typing**: Real-time validation (green/red border)
- **Loading**: Spinner, disabled input, "Searching..." text
- **Error**: Red border, error message below input
- **Success**: Results appear below, input stays filled

## 📱 Component Layout Structure

### **Header Component**
```typescript
interface HeaderProps {
  onThemeToggle?: () => void
  isDark?: boolean
}
```
- Logo + branding on left
- Theme toggle on right
- Sticky header (optional)

### **SearchForm Component**
```typescript
interface SearchFormProps {
  onSearch: (symbol: string) => void
  isLoading: boolean
  error?: string
}
```
- Centered in page
- Auto-focus on load
- Enter key submission

### **ResultsGrid Component**
```typescript
interface ResultsGridProps {
  stockData?: StockData
  isLoading: boolean
  error?: string
}
```
- Two-column layout: StockCard + ChatBox
- Responsive: stacks on mobile
- Shows/hides based on search state

## 🎨 Visual Design Specifications

### **Colors**
- **Primary**: Blue (#3B82F6) - buttons, links, accents
- **Success**: Green (#10B981) - positive stock changes
- **Error**: Red (#EF4444) - negative changes, errors
- **Background**: White/Dark gray based on theme
- **Text**: Gray-900/Gray-100 based on theme

### **Typography**
- **Heading**: text-3xl font-bold (Stock prices, titles)
- **Subheading**: text-xl font-semibold (Company names)
- **Body**: text-base (Regular text)
- **Caption**: text-sm text-gray-600 (Timestamps, sources)

### **Spacing**
- **Container**: max-w-6xl mx-auto px-4
- **Sections**: space-y-8 (32px between major sections)
- **Cards**: p-6 (24px padding)
- **Grid**: gap-6 (24px between grid items)

## 🔄 User Flow & Page States

### **State 1: Initial Load**
- Header visible
- Search form centered and focused
- Results section hidden
- Footer visible

### **State 2: Searching**
- Header visible
- Search form with loading spinner
- Results section shows loading skeleton
- Footer visible

### **State 3: Results Loaded**
- Header visible
- Search form at top with current symbol
- Results section shows StockCard + ChatBox
- Footer visible

### **State 4: Error State**
- Header visible
- Search form with error message
- Results section shows error card
- Footer visible

## 🎯 Component Priorities (Build Order)

### **Phase 1: Basic Structure**
1. Header component with branding
2. SearchForm with validation
3. Basic layout structure

### **Phase 2: Data Display**
4. StockCard component
5. Loading states
6. Error handling

### **Phase 3: Enhancement**
7. ChatBox component (Week 2)
8. Theme toggle
9. Responsive refinements

## 📐 Responsive Breakpoints

### **Mobile (< 768px)**
- Single column layout
- StockCard above ChatBox
- Larger touch targets
- Simplified spacing

### **Desktop (>= 768px)**
- Two-column grid
- Side-by-side StockCard + ChatBox
- More detailed information
- Hover states

---

**This wireframe addresses all TODO.md priorities and provides clear visual specification for implementation.**