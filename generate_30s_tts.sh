#!/bin/bash

# Generate 30-second TTS samples for all 4 Minimax voices
# Uses the Supabase Edge Function endpoint

SUPABASE_URL="https://bcufohulqrceytkrqpgd.supabase.co"
ENDPOINT="${SUPABASE_URL}/functions/v1/minimax-tts"

# 30-second text (approximately 75-100 words)
TEXT="Hello! This is a comprehensive demonstration of our AI voice receptionist system. I'm speaking at a natural pace, delivering clear and professional communication. Our intelligent system can handle customer inquiries, schedule appointments, and provide valuable information around the clock. Every interaction is designed to be helpful, courteous, and efficient. Whether you need assistance with bookings, questions about our services, or general information, I'm here to help you twenty-four seven. Thank you for listening to this voice demonstration."

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║     MINIMAX TTS - 30 SECOND AUDIO GENERATION                  ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Text length: ${#TEXT} characters"
echo "Estimated duration: ~30 seconds per voice"
echo ""

# Create output directory
mkdir -p tts-samples
cd tts-samples

SUCCESS=0
FAILED=0

# Helper to convert to lowercase (macOS compatible)
to_lower() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

# Generate for each voice
generate_voice() {
  local VOICE_NAME="$1"
  local VOICE_ID="$2"
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Generating: ${VOICE_NAME}"
  echo "Voice ID: ${VOICE_ID}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Create JSON payload
  JSON_PAYLOAD=$(cat <<JSON
{
  "text": "${TEXT}",
  "voiceId": "${VOICE_ID}",
  "speed": 1.0,
  "volume": 5,
  "pitch": 0
}
JSON
)
  
  # Call Minimax TTS Edge Function
  RESPONSE=$(curl -s -X POST "${ENDPOINT}" \
    -H "Content-Type: application/json" \
    -d "${JSON_PAYLOAD}")
  
  # Check for errors
  if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -oE '"error"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"error"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    echo "❌ Error: ${ERROR_MSG}"
    FAILED=$((FAILED + 1))
    return 1
  fi
  
  # Extract audio URL from response
  AUDIO_URL=$(echo "$RESPONSE" | grep -oE '"audio"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"audio"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  
  if [ -z "$AUDIO_URL" ]; then
    # Try audio_file field as fallback
    AUDIO_URL=$(echo "$RESPONSE" | grep -oE '"audio_file"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"audio_file"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  fi
  
  if [ -z "$AUDIO_URL" ]; then
    echo "❌ Error: Could not extract audio URL from response"
    FAILED=$((FAILED + 1))
    return 1
  fi
  
  echo "✅ Audio URL retrieved: ${AUDIO_URL:0:80}..."
  
  # Download audio file (convert voice name to lowercase)
  VOICE_LOWER=$(to_lower "$VOICE_NAME")
  FILENAME="minimax-${VOICE_LOWER}-30s.mp3"
  echo "📥 Downloading to: ${FILENAME}..."
  
  if curl -s -f -L -o "${FILENAME}" "${AUDIO_URL}"; then
    if [ -f "${FILENAME}" ]; then
      SIZE=$(ls -lh "${FILENAME}" | awk '{print $5}')
      echo "✅ Saved: ${FILENAME} (${SIZE})"
      SUCCESS=$((SUCCESS + 1))
      return 0
    else
      echo "❌ Download failed: File not created"
      FAILED=$((FAILED + 1))
      return 1
    fi
  else
    echo "❌ Download failed: curl error"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Generate all 4 voices
generate_voice "Odia" "moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc"
sleep 2

generate_voice "Marcus" "moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc"
sleep 2

generate_voice "Marcy" "moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a"
sleep 2

generate_voice "Joslyn" "moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82"

cd ..

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                        GENERATION SUMMARY                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "   Total Voices: 4"
echo "   ✅ Successful: ${SUCCESS}"
echo "   ❌ Failed: ${FAILED}"
echo "   Files saved to: ./tts-samples/"
echo ""

if [ $SUCCESS -eq 4 ]; then
  echo "🎊 All 4 voices generated successfully!"
  echo ""
  echo "Generated files:"
  ls -lh tts-samples/*.mp3 2>/dev/null | awk '{print "   ✅ " $9 " (" $5 ")"}'
elif [ $SUCCESS -gt 0 ]; then
  echo "⚠️  Some voices failed. Check errors above."
  echo ""
  echo "Successfully generated files:"
  ls -lh tts-samples/*.mp3 2>/dev/null | awk '{print "   ✅ " $9 " (" $5 ")"}'
else
  echo "❌ All voices failed. Check Minimax API configuration."
fi

echo ""
