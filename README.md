<div align="center">

# 📈 StockAI

**AI-Powered Stock Analysis Made Simple**

*Understand market movements with clear explanations and transparent sources*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](#) • [📖 Documentation](./PRD.md) • [🔧 Setup](#getting-started)

</div>

---

## ✨ What Makes StockAI Different

StockAI cuts through financial noise to deliver **clear, AI-powered explanations** for stock price movements. No complex charts, no overwhelming data—just straightforward answers to "Why did my stock move today?"

### 🎯 Core Features

🔍 **Smart Stock Lookup**  
Enter any symbol, get instant price data and market context

🤖 **AI-Powered Explanations**  
Clear, jargon-free analysis of what's driving price movements  

🔗 **Transparent Sources**  
See exactly where each piece of information comes from

💬 **Interactive Chat**  
Ask follow-up questions to deepen your understanding

🎨 **Clean Interface**  
Focused design that highlights what matters most

## 🛠️ Built With Modern Tech

<table>
<tr>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Styling</strong></td>
<td align="center"><strong>Data</strong></td>
<td align="center"><strong>Runtime</strong></td>
</tr>
<tr>
<td align="center">Next.js 15<br/>+ TypeScript</td>
<td align="center">Tailwind CSS 4.0</td>
<td align="center">Alpha Vantage API</td>
<td align="center">Node.js</td>
</tr>
</table>

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** 18 or higher
- **npm** or yarn package manager
- **Alpha Vantage API key** (free tier available)

### ⚡ Quick Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/stockai.git
cd stockai

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
cp .env.example .env.local
# Add your Alpha Vantage API key to .env.local

# 4️⃣ Start development server
npm run dev

# 5️⃣ Open in browser
# Visit http://localhost:3000
```

> **💡 Tip**: Get your free Alpha Vantage API key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)

## 📁 Project Structure

```
stockai/
├── 📱 app/                 # Next.js app directory
│   ├── 🔌 api/            # API routes
│   └── 🧩 components/     # React components
├── 📝 types/              # TypeScript definitions
├── 🛠️ utils/              # Utility functions
├── 📚 docs/               # Project documentation
└── 📋 [config files]      # ESLint, Tailwind, etc.
```

## 🔌 API Reference

### Stock Lookup Endpoint

```http
GET /api/stock?symbol=AAPL
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "change": 2.50,
    "changePercent": 1.69
  },
  "source": "Alpha Vantage"
}
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 📦 Build for production |
| `npm run start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint |
| `npm run type-check` | ✅ Run TypeScript compiler |

### 🏗️ Code Quality

<div align="center">

**TypeScript Strict Mode** • **ESLint** • **Prettier**

*Ensuring type safety, code consistency, and maintainability*

</div>

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)  
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the developer community**

*Star ⭐ this repo if you find it helpful!*

</div>