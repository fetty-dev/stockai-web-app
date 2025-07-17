import OpenAI from 'openai'
import { getOpenAiApiKey, sanitizeForLogging } from '@/utils/env'
import { StockData } from '@/types'

export class OpenAIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'OpenAIError'
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: getOpenAiApiKey(),
})

export interface AIExplanation {
  summary: string
  reasoning: string
  keyFactors: string[]
  marketContext: string
  confidence: 'high' | 'medium' | 'low'
  disclaimer: string
}

export async function explainStockMove(stockData: StockData): Promise<AIExplanation> {
  if (!stockData) {
    throw new OpenAIError('Stock data is required for explanation')
  }

  const { symbol, price, change, changePercent, volume } = stockData
  
  // Create prompt for OpenAI
  const prompt = createStockExplanationPrompt(symbol, price, change, changePercent, volume)
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: `You are a financial analyst providing clear, educational explanations of stock price movements. 
          Always provide balanced analysis and include appropriate disclaimers about investment risks.
          Format your response as JSON with the following structure:
          {
            "summary": "Brief explanation of price movement",
            "reasoning": "Detailed analysis of factors",
            "keyFactors": ["factor1", "factor2", "factor3"],
            "marketContext": "Broader market context",
            "confidence": "high|medium|low",
            "disclaimer": "Investment disclaimer"
          }`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new OpenAIError('Empty response from OpenAI')
    }

    // Parse JSON response
    const explanation: AIExplanation = JSON.parse(response)
    
    // Validate response structure
    validateAIExplanation(explanation)
    
    return explanation
    
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error
    }
    
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      throw new OpenAIError(
        `OpenAI API error: ${error.message}`,
        error.status
      )
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new OpenAIError('Invalid JSON response from OpenAI')
    }
    
    // Handle unexpected errors
    const apiKey = getOpenAiApiKey()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const sanitizedMessage = errorMessage.replace(apiKey, sanitizeForLogging(apiKey))
    
    throw new OpenAIError(`Unexpected error: ${sanitizedMessage}`)
  }
}

function createStockExplanationPrompt(
  symbol: string,
  price: number,
  change: number,
  changePercent: number,
  volume: number
): string {
  const direction = change >= 0 ? 'increased' : 'decreased'
  const changeText = change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`
  const percentText = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
  
  return `Analyze the stock movement for ${symbol}:
  
Current Price: $${price.toFixed(2)}
Price Change: ${changeText} (${percentText})
Volume: ${volume.toLocaleString()} shares
Direction: ${direction}

Please explain this stock movement in simple terms that a beginner investor can understand. 
Focus on:
1. What likely caused this price movement
2. Whether this is significant or normal volatility
3. Relevant market context
4. Key factors investors should consider

Keep explanations clear and educational. Always include appropriate investment disclaimers.`
}

function validateAIExplanation(explanation: any): asserts explanation is AIExplanation {
  const requiredFields = ['summary', 'reasoning', 'keyFactors', 'marketContext', 'confidence', 'disclaimer']
  
  for (const field of requiredFields) {
    if (!(field in explanation)) {
      throw new OpenAIError(`Missing required field: ${field}`)
    }
  }
  
  if (!Array.isArray(explanation.keyFactors)) {
    throw new OpenAIError('keyFactors must be an array')
  }
  
  if (!['high', 'medium', 'low'].includes(explanation.confidence)) {
    throw new OpenAIError('confidence must be high, medium, or low')
  }
  
  // Validate string fields are not empty
  const stringFields = ['summary', 'reasoning', 'marketContext', 'disclaimer']
  for (const field of stringFields) {
    if (typeof explanation[field] !== 'string' || explanation[field].trim().length === 0) {
      throw new OpenAIError(`${field} must be a non-empty string`)
    }
  }
}

export default openai