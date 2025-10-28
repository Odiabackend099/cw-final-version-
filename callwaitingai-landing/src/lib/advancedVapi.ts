// BULLETPROOF Vapi Voice Integration - NPM Package (No CDN Loading)
// Guaranteed to work - SDK bundled with application

import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = 'ddd720c5-6fb8-4174-b7a6-729d7b308cb9';
const VAPI_ASSISTANT_ID = 'fdaaa6f7-a204-4c08-99fd-20451c96fc74';

export interface VoiceCallOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: Error) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
}

export class AdvancedVapiService {
  private vapi: Vapi | null = null;
  private isInitialized = false;
  private isCallActive = false;
  private mediaStream: MediaStream | null = null;

  // Initialize Vapi SDK - Now instant since it's bundled!
  async initialize(): Promise<void> {
    if (this.isInitialized && this.vapi) {
      console.log('✅ Vapi already initialized');
      return;
    }

    console.log('🚀 Initializing Vapi SDK from NPM package...');

    try {
      // Create Vapi instance directly - no CDN loading needed!
      this.vapi = new Vapi(VAPI_PUBLIC_KEY);
      this.isInitialized = true;
      console.log('✅ Vapi initialized successfully (NPM package)!');
    } catch (error) {
      console.error('❌ Failed to initialize Vapi:', error);
      throw new Error(`Vapi initialization failed: ${error}`);
    }
  }

  // Start voice call with comprehensive error handling
  async startCall(options: VoiceCallOptions = {}): Promise<void> {
    console.log('🎙️ Starting voice call...');

    try {
      // Ensure initialized
      await this.initialize();

      if (this.isCallActive) {
        console.warn('⚠️ Call already in progress');
        throw new Error('Call already in progress');
      }

      if (!this.vapi) {
        throw new Error('Vapi instance not available');
      }

      // Setup event listeners first
      this.setupEventListeners(options);

      // Request microphone permission
      console.log('🎤 Requesting microphone permission...');
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        console.log('✅ Microphone permission granted');
      } catch (micError) {
        console.error('❌ Microphone permission denied:', micError);
        throw new Error('Microphone access denied. Please allow microphone access and try again.');
      }

      // Start the call with assistant ID
      console.log('📞 Starting Vapi call with assistant ID:', VAPI_ASSISTANT_ID);
      await this.vapi.start(VAPI_ASSISTANT_ID);

      this.isCallActive = true;
      console.log('✅ Call started successfully!');

      if (options.onStart) {
        options.onStart();
      }
    } catch (error) {
      console.error('❌ Failed to start call:', error);
      this.cleanup();

      if (options.onError) {
        options.onError(error as Error);
      }

      throw error;
    }
  }

  // End the voice call
  async endCall(): Promise<void> {
    if (!this.isCallActive) {
      console.log('ℹ️ No active call to end');
      return;
    }

    console.log('🛑 Ending call...');

    try {
      if (this.vapi) {
        await this.vapi.stop();
      }
      console.log('✅ Call ended successfully');
    } catch (error) {
      console.error('⚠️ Error ending call:', error);
    } finally {
      this.cleanup();
    }
  }

  // Setup Vapi event listeners
  private setupEventListeners(options: VoiceCallOptions): void {
    if (!this.vapi) return;

    console.log('🎧 Setting up event listeners...');

    this.vapi.on('call-start', () => {
      console.log('📞 Event: call-start');
      this.isCallActive = true;
      if (options.onStart) options.onStart();
    });

    this.vapi.on('call-end', () => {
      console.log('📞 Event: call-end');
      this.isCallActive = false;
      this.cleanup();
      if (options.onEnd) options.onEnd();
    });

    this.vapi.on('speech-start', () => {
      console.log('🗣️ Event: speech-start (user speaking)');
      if (options.onSpeechStart) options.onSpeechStart();
    });

    this.vapi.on('speech-end', () => {
      console.log('🤐 Event: speech-end (user stopped)');
      if (options.onSpeechEnd) options.onSpeechEnd();
    });

    this.vapi.on('message', (message: any) => {
      console.log('💬 Event: message received:', message);
      if (options.onMessage) options.onMessage(message);

      // Handle transcript messages
      if (message.type === 'transcript' && options.onTranscript) {
        options.onTranscript(message.transcript, message.isFinal || false);
      }
    });

    this.vapi.on('error', (error: any) => {
      console.error('❌ Event: error', error);
      if (options.onError) options.onError(error);
    });

    console.log('✅ Event listeners configured');
  }

  // Send message during call
  async sendMessage(message: string): Promise<void> {
    if (!this.isCallActive || !this.vapi) {
      throw new Error('No active call');
    }

    try {
      await this.vapi.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message,
        },
      });
      console.log('📤 Message sent:', message);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  // Mute/unmute microphone
  setMuted(muted: boolean): void {
    if (!this.vapi) return;

    try {
      this.vapi.setMuted(muted);
      console.log(`🎤 Microphone ${muted ? 'muted' : 'unmuted'}`);
    } catch (error) {
      console.error('❌ Failed to set mute:', error);
    }
  }

  // Check if call is active
  isActive(): boolean {
    return this.isCallActive;
  }

  // Get call status
  getStatus(): { initialized: boolean; callActive: boolean } {
    return {
      initialized: this.isInitialized,
      callActive: this.isCallActive
    };
  }

  // Cleanup resources
  private cleanup(): void {
    console.log('🧹 Cleaning up resources...');

    this.isCallActive = false;

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
        console.log('🎤 Stopped media track');
      });
      this.mediaStream = null;
    }

    console.log('✅ Cleanup complete');
  }
}

// Create singleton instance
export const advancedVapiService = new AdvancedVapiService();

// Legacy compatibility for existing code
export const vapiService = {
  async initiateCall() {
    try {
      await advancedVapiService.startCall({
        onStart: () => console.log('✅ Call started via legacy API'),
        onEnd: () => console.log('📞 Call ended via legacy API'),
        onError: (error) => console.error('❌ Call error via legacy API:', error),
      });
      return { success: true, message: 'Call initiated with Marcy' };
    } catch (error) {
      console.error('❌ Legacy API call failed:', error);
      throw error;
    }
  },

  dialDirect() {
    console.log('📞 Fallback: Direct dial to +12765825329');
    window.location.href = 'tel:+12765825329';
  },
};
