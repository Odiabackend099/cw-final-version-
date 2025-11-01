import { useState, useEffect } from 'react';
import { Save, Upload, Play, Loader2, AlertCircle, CheckCircle, Volume2, FileText, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { VoiceCallTester } from '../components/VoiceCallTester';
import { ALL_VAPI_VOICES, DEFAULT_VOICE_ID, type VapiVoice } from '../config/vapiVoices';

interface Assistant {
  id: string;
  user_id: string;
  business_name: string;
  business_industry: string;
  business_hours: string;
  timezone: string;
  system_prompt: string;
  vapi_voice_id: string | null;
  vapi_voice_provider: string | null;
  // Deprecated fields (kept for migration compatibility)
  minimax_voice_id?: string | null;
  use_minimax_tts?: boolean;
}

const DEFAULT_SYSTEM_PROMPT = `You are Marcy, a professional AI receptionist for {business_name}.

Your responsibilities:
- Answer incoming calls warmly and professionally
- Capture caller information (name, phone, reason for calling)
- Qualify leads by asking relevant questions
- Book appointments when requested
- Transfer urgent calls when necessary
- Provide business information (hours, location, services)

Business Information:
- Name: {business_name}
- Industry: {business_industry}
- Hours: {business_hours}
- Timezone: {timezone}

Communication Style:
- Be warm, friendly, and professional
- Speak clearly and at a moderate pace
- Listen actively and confirm important details
- Use the caller's name when possible
- Stay on topic and avoid unnecessary chatter

Response Guidelines:
- Keep responses under 25 words when possible
- If you don't know something, say so honestly
- Never make up information or appointments
- Always confirm before ending the call`;

const AgentSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingCall, setTestingCall] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [businessHours, setBusinessHours] = useState('Monday-Friday 9AM-5PM');
  const [timezone, setTimezone] = useState('America/New_York');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(DEFAULT_VOICE_ID);
  const [selectedVoiceProvider, setSelectedVoiceProvider] = useState<string>('vapi');

  // Data state
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState<File[]>([]);
  const [uploadingKb, setUploadingKb] = useState(false);

  // Voice call tester state
  const [showCallTester, setShowCallTester] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load assistant configuration
      const { data: assistantData, error: assistantError } = await supabase
        .from('assistants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (assistantError && assistantError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (first time setup)
        throw assistantError;
      }

      if (assistantData) {
        setAssistant(assistantData);
        setBusinessName(assistantData.business_name || '');
        setBusinessIndustry(assistantData.business_industry || '');
        setBusinessHours(assistantData.business_hours || 'Monday-Friday 9AM-5PM');
        setTimezone(assistantData.timezone || 'America/New_York');
        setSystemPrompt(assistantData.system_prompt || DEFAULT_SYSTEM_PROMPT);
        setSelectedVoiceId(assistantData.vapi_voice_id || DEFAULT_VOICE_ID);
        setSelectedVoiceProvider(assistantData.vapi_voice_provider || 'vapi');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error loading data:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setMessage(null);

      // Replace placeholders in system prompt
      const processedPrompt = systemPrompt
        .replace(/{business_name}/g, businessName)
        .replace(/{business_industry}/g, businessIndustry)
        .replace(/{business_hours}/g, businessHours)
        .replace(/{timezone}/g, timezone);

      const assistantData = {
        user_id: user.id,
        business_name: businessName,
        business_industry: businessIndustry,
        business_hours: businessHours,
        timezone: timezone,
        system_prompt: processedPrompt,
        vapi_voice_id: selectedVoiceId || DEFAULT_VOICE_ID,
        vapi_voice_provider: selectedVoiceProvider || 'vapi',
        updated_at: new Date().toISOString(),
      };

      if (assistant) {
        // Update existing assistant
        const { data: updatedAssistant, error } = await supabase
          .from('assistants')
          .update(assistantData)
          .eq('id', assistant.id)
          .select()
          .single();

        if (error) throw error;
        // Update assistant state with fresh data so VoiceCallTester uses latest config
        setAssistant(updatedAssistant);
      } else {
        // Create new assistant
        const { data, error } = await supabase
          .from('assistants')
          .insert([assistantData])
          .select()
          .single();

        if (error) throw error;
        setAssistant(data);
      }

      // Ensure selected voice ID matches what was saved
      if (selectedVoiceId) {
        setSelectedVoiceId(selectedVoiceId);
      }

      setMessage({ type: 'success', text: 'Agent configuration saved successfully!' });
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error saving:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleKnowledgeBaseUpload = async () => {
    if (knowledgeBaseFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload' });
      return;
    }

    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to upload files' });
      return;
    }

    try {
      setUploadingKb(true);
      setMessage(null);

      // SUBTASK 2 FIX: Auto-save agent before upload if not already saved
      let currentAssistant = assistant;

      if (!currentAssistant) {
        setMessage({ type: 'info', text: 'Saving agent configuration...' });

        // Replace placeholders in system prompt
        const processedPrompt = systemPrompt
          .replace(/{business_name}/g, businessName)
          .replace(/{business_industry}/g, businessIndustry)
          .replace(/{business_hours}/g, businessHours)
          .replace(/{timezone}/g, timezone);

        const assistantData = {
          user_id: user.id,
          business_name: businessName,
          business_industry: businessIndustry,
          business_hours: businessHours,
          timezone: timezone,
          system_prompt: processedPrompt,
          vapi_voice_id: selectedVoiceId || DEFAULT_VOICE_ID,
          vapi_voice_provider: selectedVoiceProvider || 'vapi',
          updated_at: new Date().toISOString(),
        };

        // Create new assistant
        const { data, error } = await supabase
          .from('assistants')
          .insert([assistantData])
          .select()
          .single();

        if (error) throw error;
        currentAssistant = data;
        setAssistant(data);
        setMessage({ type: 'info', text: 'Agent saved. Uploading files...' });
      }

      // Now upload files
      for (const file of knowledgeBaseFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentAssistant.id}/${Date.now()}_${file.name}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('knowledge-base')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save file reference to database
        const { error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert([{
            assistant_id: currentAssistant.id,
            file_name: file.name,
            file_path: fileName,
            file_type: fileExt,
            file_size: file.size,
          }]);

        if (dbError) throw dbError;
      }

      setMessage({ type: 'success', text: `${knowledgeBaseFiles.length} file(s) uploaded successfully!` });
      setKnowledgeBaseFiles([]);
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error uploading knowledge base:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingKb(false);
    }
  };

  const handleTestCall = async () => {
    // If assistant doesn't exist or voice was changed, save first
    if (!assistant || (selectedVoiceId && assistant.vapi_voice_id !== selectedVoiceId)) {
      setMessage({ type: 'info', text: 'Saving configuration before test call...' });

      try {
        await handleSave();
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to save configuration. Please try again.' });
        return;
      }
    }

    // Reload assistant data to ensure VoiceCallTester gets latest voice config
    if (assistant) {
      const { data: freshAssistant, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('id', assistant.id)
        .single();

      if (!error && freshAssistant) {
        setAssistant(freshAssistant);
      }
    }

    if (!assistant) {
      setMessage({ type: 'error', text: 'Please save your agent configuration first' });
      return;
    }

    // Open voice call tester
    setShowCallTester(true);
  };


  const testAgentConfiguration = async () => {
    if (!assistant) {
      setMessage({ type: 'error', text: 'Please save your agent configuration first' });
      return false;
    }

    try {
      setMessage({ type: 'info', text: 'Testing agent configuration...' });

      // Validate agent has all required fields
      const isValid = Boolean(
        assistant.business_name &&
        assistant.system_prompt &&
        assistant.business_hours &&
        assistant.timezone
      );

      if (isValid) {
        if (import.meta.env.DEV) {
          console.log('✅ AGENT TEST: TRUE/OK');
          console.log('═══════════════════════════');
          console.log('Agent ID:', assistant.id);
          console.log('Business:', assistant.business_name);
          console.log('Industry:', assistant.business_industry);
          console.log('Hours:', assistant.business_hours);
          console.log('Timezone:', assistant.timezone);
          console.log('System Prompt Length:', assistant.system_prompt.length, 'chars');
          console.log('Voice Config:', {
            vapi_voice_id: assistant.vapi_voice_id,
            vapi_voice_provider: assistant.vapi_voice_provider,
          });
          console.log('═══════════════════════════');
          console.log('RESULT: TRUE');
          console.log('STATUS: OK');
          console.log('═══════════════════════════');
        }

        setMessage({ type: 'success', text: '✅ Agent configuration validated successfully! Check console for details.' });
        return true;
      } else {
        if (import.meta.env.DEV) {
          console.log('❌ AGENT TEST: FALSE/ERROR');
          console.log('Missing required fields');
        }
        setMessage({ type: 'error', text: 'Agent configuration incomplete. Missing required fields.' });
        return false;
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('❌ AGENT TEST ERROR:', error);
      setMessage({ type: 'error', text: `Test failed: ${error.message}` });
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Setup</h1>
          <p className="text-gray-600 mt-1">Configure your AI receptionist's personality and voice</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={testAgentConfiguration}
            disabled={!assistant}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Test configuration in terminal (console logs TRUE/OK)"
          >
            <CheckCircle className="w-4 h-4" />
            Test Config
          </button>
          <button
            onClick={handleTestCall}
            disabled={testingCall || !assistant}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingCall ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Test Call
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`flex items-start gap-3 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : message.type === 'info'
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : message.type === 'info' ? (
            <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${
            message.type === 'success'
              ? 'text-green-800'
              : message.type === 'info'
              ? 'text-blue-800'
              : 'text-red-800'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Business Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Smith & Co."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <input
                  type="text"
                  value={businessIndustry}
                  onChange={(e) => setBusinessIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Legal Services, Plumbing, Dentistry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours *
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Monday-Friday 9AM-5PM"
                />
              </div>

              <div>
                <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone *
                </label>
                <select
                  id="timezone-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select timezone"
                >
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Configuration
            </h2>

            <div className="space-y-4">
              {/* Voice Provider Selection */}
              <div>
                <label htmlFor="voice-provider" className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Provider
                </label>
                <select
                  id="voice-provider"
                  value={selectedVoiceProvider}
                  onChange={(e) => {
                    const provider = e.target.value;
                    setSelectedVoiceProvider(provider);
                    // Auto-select first voice of new provider
                    const firstVoice = ALL_VAPI_VOICES.find(v => v.provider === provider);
                    if (firstVoice) setSelectedVoiceId(firstVoice.id);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vapi">Vapi Native Voices (Free)</option>
                  <option value="elevenlabs">ElevenLabs (Premium - Requires API Key)</option>
                  <option value="playht">PlayHT (Premium - Requires API Key)</option>
                  <option value="azure">Azure (Premium - Requires API Key)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedVoiceProvider === 'vapi'
                    ? 'Free, high-quality voices included with all plans'
                    : 'Premium providers require API key configuration in Vapi dashboard'}
                </p>
              </div>

              {/* Voice Selection */}
              <div>
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Voice
                </label>
                <select
                  id="voice-select"
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ALL_VAPI_VOICES
                    .filter(v => v.provider === selectedVoiceProvider)
                    .map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.gender}, {voice.accent} ({voice.age}yo)
                      </option>
                    ))}
                </select>
              </div>

              {/* Voice Preview */}
              {(() => {
                const selectedVoice = ALL_VAPI_VOICES.find(v => v.id === selectedVoiceId);
                return selectedVoice ? (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Volume2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{selectedVoice.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Style:</span> {selectedVoice.description}</p>
                          <p><span className="font-medium">Accent:</span> {selectedVoice.accent}</p>
                          <p><span className="font-medium">Age:</span> {selectedVoice.age} years old</p>
                          <p><span className="font-medium">Provider:</span> {selectedVoice.provider.toUpperCase()}</p>
                        </div>
                        {selectedVoice.isPremium && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            <CheckCircle className="w-3 h-3" />
                            Premium Voice
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Your selected voice will be used for both test calls and production calls.
                    {selectedVoiceProvider !== 'vapi' && ' Premium providers require API key setup in your Vapi dashboard.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Knowledge Base
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload documents (PDF, TXT) or provide URLs to train your AI agent.
              </p>

              <div>
                <label htmlFor="knowledge-base-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Knowledge Base Files
                </label>
                <input
                  id="knowledge-base-upload"
                  type="file"
                  multiple
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => setKnowledgeBaseFiles(Array.from(e.target.files || []))}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  aria-label="Upload knowledge base files"
                />
              </div>

              {knowledgeBaseFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {knowledgeBaseFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleKnowledgeBaseUpload}
                    disabled={uploadingKb}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploadingKb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: System Prompt */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Prompt</h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Customize how your AI agent responds. Use <code className="bg-gray-100 px-1 rounded">{'{business_name}'}</code> placeholders.
              </p>

              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={24}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter system prompt..."
              />

              <button
                onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset to default template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Configuration
            </>
          )}
        </button>
      </div>

      {/* Voice Call Tester Modal */}
      {showCallTester && assistant && (
        <VoiceCallTester
          assistant={assistant}
          onClose={() => setShowCallTester(false)}
        />
      )}
    </div>
  );
};

export default AgentSetup;
