// Vapi Voice AI Integration
const VAPI_PUBLIC_KEY = 'ddd720c5-6fb8-4174-b7a6-729d7b308cb9';
const VAPI_ASSISTANT_ID = 'fdaaa6f7-a204-4c08-99fd-20451c96fc74';

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
