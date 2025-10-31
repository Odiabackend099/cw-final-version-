// Vapi Voice AI Integration
import { VAPI_CONFIG } from './supabase';

const VAPI_PUBLIC_KEY = VAPI_CONFIG.publicKey;
const VAPI_ASSISTANT_ID = VAPI_CONFIG.assistantId;

export const vapiService = {
  // Initialize Vapi voice call
  async initiateCall() {
    try {
      // Load Vapi SDK dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Initialize Vapi instance
      // @ts-ignore - Vapi is loaded dynamically
      const vapi = new window.Vapi(VAPI_PUBLIC_KEY);

      // Start the call with Marcy assistant
      await vapi.start(VAPI_ASSISTANT_ID);

      return { success: true, message: 'Call initiated with Marcy' };
    } catch (error) {
      console.error('Vapi call error:', error);
      throw new Error('Failed to initiate voice call');
    }
  },

  // Fallback: Direct phone call
  dialDirect() {
    window.location.href = 'tel:+12765825329';
  },
};
