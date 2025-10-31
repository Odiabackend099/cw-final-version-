/**
 * Generate 30-second TTS audio samples for all 4 Minimax voices
 * 
 * This script generates approximately 30 seconds of speech for each voice ID
 * and saves the audio files locally for testing/demonstration.
 */

const VOICES = [
  {
    id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    name: 'Odia',
    description: 'African male - Warm and professional'
  },
  {
    id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
    name: 'Marcus',
    description: 'American male - Confident and clear'
  },
  {
    id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
    name: 'Marcy',
    description: 'American female - Warm and welcoming'
  },
  {
    id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
    name: 'Joslyn',
    description: 'African female - Clear and friendly'
  }
];

// Text that will take approximately 30 seconds to speak
// Average speaking rate: 150 words per minute = 2.5 words per second
// 30 seconds = ~75 words
const TEXT_30_SECONDS = `
Hello! This is a comprehensive demonstration of our AI voice receptionist system. 
I'm speaking at a natural pace, delivering clear and professional communication. 
Our intelligent system can handle customer inquiries, schedule appointments, and provide 
valuable information around the clock. Every interaction is designed to be helpful, 
courteous, and efficient. Whether you need assistance with bookings, questions about 
our services, or general information, I'm here to help you twenty-four seven. 
Thank you for listening to this voice demonstration.
`.trim().replace(/\s+/g, ' ');

const SUPABASE_URL = 'https://bcufohulqrceytkrqpgd.supabase.co';
const MINIMAX_ENDPOINT = `${SUPABASE_URL}/functions/v1/minimax-tts`;

interface TTSResponse {
  success: boolean;
  audio?: string;
  audio_file?: string;
  error?: string;
  request_id?: string;
}

async function generateTTS(voiceId: string, voiceName: string, text: string): Promise<string | null> {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`Generating TTS for: ${voiceName}`);
  console.log(`Voice ID: ${voiceId}`);
  console.log(`Text length: ${text.length} characters`);
  console.log(`${'═'.repeat(70)}`);

  try {
    const response = await fetch(MINIMAX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voiceId: voiceId,
        speed: 1.0,
        volume: 5,
        pitch: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error: ${response.status} - ${errorText}`);
      return null;
    }

    const data: TTSResponse = await response.json();

    if (data.success && (data.audio || data.audio_file)) {
      const audioUrl = data.audio || data.audio_file;
      console.log(`✅ Success! Audio URL: ${audioUrl}`);
      return audioUrl!;
    } else {
      console.error(`❌ Error: ${data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error: any) {
    console.error(`❌ Exception: ${error.message}`);
    return null;
  }
}

async function downloadAudio(url: string, filename: string): Promise<boolean> {
  try {
    console.log(`📥 Downloading: ${filename}...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`❌ Download failed: ${response.status}`);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create output directory if it doesn't exist
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const outputDir = path.join(process.cwd(), 'tts-samples');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, buffer);
    
    const stats = await fs.stat(filepath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ Saved: ${filepath} (${sizeKB} KB)`);
    
    return true;
  } catch (error: any) {
    console.error(`❌ Download error: ${error.message}`);
    return false;
  }
}

async function generateAllSamples() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║     MINIMAX TTS - 30 SECOND AUDIO GENERATION                  ║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  
  console.log(`\n📝 Text to convert (${TEXT_30_SECONDS.length} characters):`);
  console.log(`"${TEXT_30_SECONDS.substring(0, 100)}..."`);
  console.log(`\nEstimated duration: ~30 seconds per voice`);
  console.log(`Total voices: ${VOICES.length}`);
  console.log(`\n${'═'.repeat(70)}\n`);

  const results: Array<{ voice: string; success: boolean; filename?: string }> = [];

  for (const voice of VOICES) {
    const audioUrl = await generateTTS(voice.id, voice.name, TEXT_30_SECONDS);
    
    if (audioUrl) {
      const filename = `minimax-${voice.name.toLowerCase()}-30s.mp3`;
      const downloaded = await downloadAudio(audioUrl, filename);
      
      results.push({
        voice: voice.name,
        success: downloaded,
        filename: downloaded ? filename : undefined
      });
      
      // Wait between requests to avoid rate limiting
      if (voice !== VOICES[VOICES.length - 1]) {
        console.log('\n⏳ Waiting 2 seconds before next request...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else {
      results.push({
        voice: voice.name,
        success: false
      });
    }
  }

  // Summary
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║                        GENERATION SUMMARY                    ║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`   Total Voices: ${VOICES.length}`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n   Files saved to: ./tts-samples/`);

  if (successful > 0) {
    console.log(`\n   Generated files:`);
    results
      .filter(r => r.success && r.filename)
      .forEach(r => {
        console.log(`      ✅ ${r.voice}: ${r.filename}`);
      });
  }

  if (failed > 0) {
    console.log(`\n   Failed voices:`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`      ❌ ${r.voice}`);
      });
  }

  console.log(`\n${'═'.repeat(70)}\n`);

  if (successful === VOICES.length) {
    console.log('🎊 All voices generated successfully!');
  } else if (successful > 0) {
    console.log('⚠️  Some voices failed to generate. Check errors above.');
  } else {
    console.log('❌ All voices failed. Check your Minimax API configuration.');
  }

  console.log('\n');
}

// Run the generator
generateAllSamples().catch(console.error);

