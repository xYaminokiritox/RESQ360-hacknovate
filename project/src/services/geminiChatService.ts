import { Alert } from '../types/alert';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export interface GeminiMessage {
  text: string;
  type: 'user' | 'bot' | 'error';
  suggestions?: string[];
  links?: ServiceLink[];
}

interface ServiceLink {
  title: string;
  url: string;
  description: string;
  number?: string;
}

class GeminiChatService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;
  
  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
    } else {
      try {
        // Initialize the Generative AI SDK
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        console.log('Gemini AI service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
        this.genAI = null;
      }
    }
  }

  async getResponse(message: string): Promise<GeminiMessage> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      try {
        // First try using the SDK
        if (this.genAI) {
          return await this.getResponseWithSdk(message);
        }
      } catch (sdkError) {
        console.error('Error with SDK approach, falling back to direct API:', sdkError);
      }

      // Fallback to direct API call if SDK fails
      return await this.getResponseWithDirectApi(message);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      return {
        text: 'Sorry, I encountered an error while processing your request. Please try again later.',
        type: 'error'
      };
    }
  }

  private async getResponseWithSdk(message: string): Promise<GeminiMessage> {
    if (!this.genAI) {
      throw new Error('SDK not initialized');
    }

    // Get the generative model - using gemini-2.0-flash which is the current model as per documentation
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Start a chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful AI assistant for an emergency response app called ResQ360. Your primary goal is to help users find safety resources, understand their legal rights during emergencies, and provide general safety advice. Please follow these important formatting rules:\n\n1. Provide only plain text without any formatting\n2. Do not use markdown formatting (no asterisks for bold/italic, no hashtags for headings)\n3. Do not add bullet points or numbered lists with special characters\n4. Keep responses concise, direct and factual\n5. Focus only on safety and emergency response information\n6. When explaining steps or procedures, use simple numbered format like '1.' or simple text descriptions\n\nAlways prioritize clarity and simplicity in your responses." }],
        },
        {
          role: "model",
          parts: [{ text: "I understand my role as an AI assistant for ResQ360. I'll provide plain text responses without any special formatting, focusing on clear, concise safety and emergency information. I won't use markdown, special characters, or formatting elements like bold or headings. I'll keep everything straightforward and factual, prioritizing clarity when explaining safety resources, legal rights, and emergency procedures. How can I help you today?" }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    // Generate content
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();
    
    // Process suggestions
    const suggestions = this.extractSuggestions(responseText);
    
    // Process links
    const links = this.extractLinks(responseText);

    return {
      text: responseText,
      type: 'bot',
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      links: links.length > 0 ? links : undefined
    };
  }

  private async getResponseWithDirectApi(message: string): Promise<GeminiMessage> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    // Add formatting instructions to the user message
    const formattedMessage = `Please respond in plain text only without any markdown formatting (no asterisks for bold/italic, no hashtags for headings). Keep your response clear, concise and avoid using any special formatting. USER QUERY: ${message}`;

    // Direct API call as per the documentation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: formattedMessage }]
        }]
      })
    });

    if (!response.ok) {
      // If gemini-2.0-flash fails, try gemini-1.5-flash
      const urlFallback = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      
      const responseFallback = await fetch(urlFallback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: formattedMessage }]
          }]
        })
      });

      if (!responseFallback.ok) {
        throw new Error(`API request failed with status: ${responseFallback.status}`);
      }

      const data = await responseFallback.json();
      let responseText = '';
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        responseText = data.candidates[0].content.parts[0].text;
      }

      return {
        text: responseText || "Sorry, I couldn't generate a response.",
        type: 'bot'
      };
    }

    const data = await response.json();
    let responseText = '';
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      responseText = data.candidates[0].content.parts[0].text;
    }

    return {
      text: responseText || "Sorry, I couldn't generate a response.",
      type: 'bot'
    };
  }

  private extractSuggestions(text: string): string[] {
    // Simple parsing logic - in a real app you might use a more sophisticated approach
    // or have the AI return structured data
    const suggestions: string[] = [];
    
    // Return empty array as this is a simplified example
    // In a real implementation, you would parse the text for suggestions
    return suggestions;
  }

  private extractLinks(text: string): ServiceLink[] {
    // Simple parsing logic - in a real app you might use a more sophisticated approach
    // or have the AI return structured data
    const links: ServiceLink[] = [];
    
    // Return empty array as this is a simplified example
    // In a real implementation, you would parse the text for links
    return links;
  }

  async getOfflineResponse(message: string): Promise<GeminiMessage> {
    // This is a fallback for when the API is not available
    // Simple pattern matching for basic responses
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        text: "Hello! I'm your safety assistant powered by Gemini. How can I help you today?",
        type: 'bot',
        suggestions: ['Emergency contacts', 'Safety tips', 'Report emergency']
      };
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      return {
        text: "If you're experiencing an emergency, please call your local emergency number immediately.",
        type: 'bot',
        links: [
          {
            title: 'Emergency Services',
            url: '#',
            description: 'Call for immediate assistance',
            number: '911'
          }
        ]
      };
    }

    return {
      text: "I'm in offline mode right now. For emergencies, please contact emergency services directly.",
      type: 'bot',
      suggestions: ['Emergency contacts', 'Safety tips']
    };
  }

  // Test method to check if API key is valid using direct API call
  async testApiKey(): Promise<{ isValid: boolean; message: string }> {
    try {
      if (!this.apiKey) {
        return { 
          isValid: false, 
          message: 'API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.' 
        };
      }

      try {
        // First try with the SDK for gemini-2.0-flash
        if (this.genAI) {
          try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent("Hello, please respond with 'API key is valid' if you can read this message.");
            return { 
              isValid: true, 
              message: 'API key is valid and working with the gemini-2.0-flash model using SDK.' 
            };
          } catch (error) {
            console.error('SDK with gemini-2.0-flash failed, trying gemini-1.5-flash', error);
            
            // Try alternative model with SDK
            try {
              const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
              const result = await model.generateContent("Hello");
              return { 
                isValid: true, 
                message: 'API key is valid and working with the gemini-1.5-flash model using SDK.' 
              };
            } catch (fallbackError) {
              console.error('SDK with gemini-1.5-flash failed as well, trying direct API', fallbackError);
            }
          }
        }
      } catch (sdkError) {
        console.error('Error with SDK approach:', sdkError);
      }

      // Try direct API call for gemini-2.0-flash if SDK fails
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Hello, please respond with 'API key is valid'" }]
            }]
          })
        });

        if (response.ok) {
          return { 
            isValid: true, 
            message: 'API key is valid and working with the gemini-2.0-flash model using direct API call.' 
          };
        }
        
        // Try gemini-1.5-flash as fallback
        const urlFallback = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const responseFallback = await fetch(urlFallback, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Hello, please respond with 'API key is valid'" }]
            }]
          })
        });

        if (responseFallback.ok) {
          return { 
            isValid: true, 
            message: 'API key is valid and working with the gemini-1.5-flash model using direct API call.' 
          };
        }

        return { 
          isValid: false, 
          message: `API request failed with status: ${response.status} for 2.0 and ${responseFallback.status} for 1.5` 
        };
      } catch (directApiError: any) {
        return { 
          isValid: false, 
          message: `Direct API call failed: ${directApiError.message}` 
        };
      }
    } catch (error: any) {
      console.error('Error testing Gemini API key:', error);
      return { 
        isValid: false, 
        message: `API key test failed: ${error.message || 'Unknown error'}` 
      };
    }
  }
}

export const geminiChatService = new GeminiChatService(); 