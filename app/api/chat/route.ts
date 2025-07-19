import { NextRequest, NextResponse } from 'next/server'
import { getOpenAiApiKey, sanitizeForLogging } from '@/utils/env'
import OpenAI from 'openai'

export interface ChatResponse {
  success: boolean
  message?: string
  sources?: string[]
  error?: string
  shouldSearchWeb?: boolean
  clarifyingQuestions?: string[]
}

const openai = new OpenAI({
  apiKey: getOpenAiApiKey(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, symbol, stockData, conversationHistory = [] } = body

    if (!message || !symbol) {
      return NextResponse.json<ChatResponse>({
        success: false,
        error: 'Message and symbol are required'
      }, { status: 400 })
    }

    // Create enhanced prompt with stock data and web search capabilities
    const systemPrompt = `You are an expert stock analyst AI assistant specializing in ${symbol}. You have access to current stock data and can search the web for additional information when needed.

Current Stock Data for ${symbol}:
- Price: $${stockData?.price || 'N/A'}
- Change: ${stockData?.change >= 0 ? '+' : ''}$${stockData?.change || 'N/A'} (${stockData?.changePercent || 'N/A'}%)
- Volume: ${stockData?.volume?.toLocaleString() || 'N/A'}
- Market Cap: $${stockData?.marketCap ? (stockData.marketCap / 1000).toFixed(1) + 'B' : 'N/A'}
- Company: ${stockData?.companyName || symbol}

Guidelines:
1. Provide helpful, accurate analysis about ${symbol}
2. If you need current news, earnings data, or recent events, indicate you should search the web
3. Ask clarifying questions when the user's question is vague
4. Use the provided stock data in your analysis
5. Be conversational but professional
6. Explain complex financial concepts in simple terms
7. Always include appropriate disclaimers about investment risks

If you determine web search is needed, respond with "shouldSearchWeb": true.
If you need clarification, provide up to 3 relevant clarifying questions.

Provide a helpful, conversational response about the stock. If you need current news or recent data to give a complete answer, mention that you'll search for latest information.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    // First, get AI response to determine if web search is needed
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000
      // Remove JSON format requirement to avoid nested JSON issues
    })

    const aiResponse = completion.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('Empty response from OpenAI')
    }

    let responseData
    
    // Try to parse as JSON first
    try {
      responseData = JSON.parse(aiResponse)
    } catch (error) {
      // If not valid JSON, treat as regular text and check for web search indicators
      const needsWebSearch = aiResponse.toLowerCase().includes('search') || 
                            aiResponse.toLowerCase().includes('latest') ||
                            aiResponse.toLowerCase().includes('current news') ||
                            aiResponse.toLowerCase().includes('recent')
      
      responseData = {
        message: aiResponse,
        shouldSearchWeb: needsWebSearch,
        clarifyingQuestions: []
      }
    }

    // If AI indicates web search is needed, perform search
    if (responseData.shouldSearchWeb) {
      try {
        // Construct search query based on the user's question and stock symbol
        const searchQuery = `${symbol} stock ${message} latest news ${new Date().getFullYear()}`
        
        // Use WebSearch to get current information
        const searchResults = await performWebSearch(searchQuery)
        
        // Create enhanced prompt with search results
        const enhancedPrompt = `${systemPrompt}

Recent Web Search Results for "${searchQuery}":
${searchResults}

Now please provide a comprehensive answer using both the stock data and the search results. Be sure to cite relevant information from the search results.`

        const enhancedCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: enhancedPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1200
        })

        const enhancedResponse = enhancedCompletion.choices[0]?.message?.content || responseData.message
        
        return NextResponse.json<ChatResponse>({
          success: true,
          message: enhancedResponse,
          sources: ['OpenAI GPT-4', 'Web Search Results'],
          shouldSearchWeb: false
        })
        
      } catch (searchError) {
        console.error('Web search failed:', searchError)
        // Return original response if search fails
      }
    }

    return NextResponse.json<ChatResponse>({
      success: true,
      message: responseData.message || responseData.analysis || 'I can help you analyze this stock. What would you like to know?',
      clarifyingQuestions: responseData.clarifyingQuestions,
      sources: ['OpenAI GPT-4', 'Current Stock Data']
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    const apiKey = getOpenAiApiKey()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const sanitizedMessage = errorMessage.replace(apiKey, sanitizeForLogging(apiKey))

    return NextResponse.json<ChatResponse>({
      success: false,
      error: `Failed to process chat message: ${sanitizedMessage}`
    }, { status: 500 })
  }
}

async function performWebSearch(query: string): Promise<string> {
  try {
    // This would integrate with a web search API
    // For now, return a placeholder that indicates search capability
    return `[Web search capability enabled - would search for: "${query}"]
    
Note: In a production environment, this would return real-time search results about ${query}, including:
- Latest news articles
- Recent earnings reports
- Market analysis
- Company announcements
- Industry trends
    
To enable full web search, integrate with services like:
- Google Custom Search API
- Bing Search API
- NewsAPI
- Financial news aggregators`
  } catch (error) {
    console.error('Web search error:', error)
    return 'Web search temporarily unavailable'
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Only POST requests are supported'
  }, { status: 405 })
}