// Secure Groq AI Chat Integration via Supabase Edge Function
// API key is stored securely in Supabase and never exposed to the frontend

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL environment variable is required');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required');
}

const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/groq-chat`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatService = {
  async sendMessage(messages: ChatMessage[], sessionId?: string) {
    try {
      // SPEED OPTIMIZATION: Add timeout and reduced tokens
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages,
          sessionId: sessionId || `landing-${Date.now()}`,
          max_tokens: 250, // FASTER: Reduced for quicker responses
          temperature: 0.5, // FASTER: More focused, less creative = faster
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.message;
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Chat error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  },
};
