// Secure Groq AI Chat Integration via Supabase Edge Function
// API key is stored securely in Supabase and never exposed to the frontend

const SUPABASE_FUNCTION_URL = 'https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/groq-chat';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatService = {
  async sendMessage(messages: ChatMessage[], sessionId?: string) {
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages,
          sessionId: sessionId || `landing-${Date.now()}`, // Generate session ID for tracking
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.message;
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  },
};
