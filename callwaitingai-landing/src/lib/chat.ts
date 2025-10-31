// Secure Groq AI Chat Integration via Supabase Edge Function
// API key is stored securely in Supabase and never exposed to the frontend

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bcufohulqrceytkrqpgd.supabase.co';
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/groq-chat`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
      console.error('Chat error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  },
};
