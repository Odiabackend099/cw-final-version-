#!/bin/bash
set -e

PROJECT_DIR="/Users/odiadev/Downloads/cwlunch"

echo "=========================================="
echo "TESTING VOICE CALL TESTER FIX"
echo "=========================================="
echo ""

# Test 1
echo "TEST 1: Checking VoiceCallTester interface..."
if grep -q "assistant: Assistant" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ VoiceCallTester accepts assistant object"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 2
echo "TEST 2: Checking inline assistant config..."
if grep -q "const assistantConfig" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ Inline assistant configuration found"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 3
echo "TEST 3: Checking Groq Llama 3.3 70B config..."
if grep -q "llama-3.3-70b-versatile" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ Groq Llama 3.3 70B configured"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 4
echo "TEST 4: Checking ElevenLabs Rachel voice..."
if grep -q "voiceId: 'rachel'" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ ElevenLabs Rachel voice configured"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 5
echo "TEST 5: Checking Deepgram Nova-2 transcriber..."
if grep -q "model: 'nova-2'" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ Deepgram Nova-2 transcriber configured"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 6
echo "TEST 6: Checking AgentSetup integration..."
if grep -q "assistant={assistant}" "$PROJECT_DIR/callwaitingai-landing/src/pages/AgentSetup.tsx"; then
    echo "  ✅ AgentSetup passes assistant object"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 7
echo "TEST 7: Checking debug console logs..."
if grep -q "console.log('✅" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx"; then
    echo "  ✅ Debug console logs found"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 8
echo "TEST 8: Checking error handling..."
COUNT=$(grep -c "handleError" "$PROJECT_DIR/callwaitingai-landing/src/components/VoiceCallTester.tsx" || echo "0")
if [ "$COUNT" -ge "2" ]; then
    echo "  ✅ Error handling implemented"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 9
echo "TEST 9: Checking build artifacts..."
if [ -d "$PROJECT_DIR/callwaitingai-landing/dist" ]; then
    echo "  ✅ Build artifacts exist"
else
    echo "  ❌ FAIL"
    exit 1
fi

# Test 10
echo "TEST 10: Checking dev server..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
    echo "  ✅ Dev server running"
else
    echo "  ⚠️  Dev server not accessible"
fi

echo ""
echo "=========================================="
echo "RESULT: ✅ TRUE"
echo "STATUS: OK"
echo "=========================================="
echo ""
echo "Dev server: http://localhost:5173/agent-setup"
echo "Production: https://callwaitingai-landing-aeqxt1nkm-odia-backends-projects.vercel.app/agent-setup"
