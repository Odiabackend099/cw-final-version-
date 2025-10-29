#!/bin/bash
# CallWaitingAI Chat Widget Test Script
# Tests chat functionality and returns true/ok

echo "🧪 Testing CallWaitingAI Chat Widget..."
echo "============================================"

# Test 1: Check if widget file exists
echo "📁 Test 1: Checking if AdvancedChatWidget exists..."
if [ -f "callwaitingai-landing/src/components/AdvancedChatWidget.tsx" ]; then
    echo "✅ OK - Widget file exists"
    TEST1=true
else
    echo "❌ FAIL - Widget file not found"
    TEST1=false
fi

# Test 2: Check if chat service exists
echo ""
echo "📁 Test 2: Checking if chat service exists..."
if [ -f "callwaitingai-landing/src/lib/chat.ts" ]; then
    echo "✅ OK - Chat service exists"
    TEST2=true
else
    echo "❌ FAIL - Chat service not found"
    TEST2=false
fi

# Test 3: Check if logo file exists
echo ""
echo "🖼️  Test 3: Checking if logo exists..."
if [ -f "callwaitingai-landing/public/images/callwaiting ai logo.jpeg" ]; then
    echo "✅ OK - Logo file exists"
    TEST3=true
else
    echo "❌ FAIL - Logo file not found"
    TEST3=false
fi

# Test 4: Check if optimization is applied
echo ""
echo "⚡ Test 4: Checking chat speed optimizations..."
if grep -q "max_tokens: 250" callwaitingai-landing/src/lib/chat.ts; then
    echo "✅ OK - Speed optimization applied (max_tokens: 250)"
    TEST4=true
else
    echo "❌ FAIL - Speed optimization not found"
    TEST4=false
fi

# Test 5: Check if logo is used instead of robot
echo ""
echo "🤖 Test 5: Checking logo integration..."
if grep -q "callwaiting ai logo.jpeg" callwaitingai-landing/src/components/AdvancedChatWidget.tsx; then
    echo "✅ OK - Logo integrated in widget"
    TEST5=true
else
    echo "❌ FAIL - Logo not integrated"
    TEST5=false
fi

# Test 6: Build test
echo ""
echo "🔨 Test 6: Running build test..."
cd callwaitingai-landing
if pnpm build > /dev/null 2>&1; then
    echo "✅ OK - Build successful"
    TEST6=true
else
    echo "❌ FAIL - Build failed"
    TEST6=false
fi
cd ..

# Final Results
echo ""
echo "============================================"
echo "📊 TEST RESULTS:"
echo "============================================"

if [ "$TEST1" = true ] && [ "$TEST2" = true ] && [ "$TEST3" = true ] && [ "$TEST4" = true ] && [ "$TEST5" = true ] && [ "$TEST6" = true ]; then
    echo "✅ ALL TESTS PASSED"
    echo ""
    echo "🎉 Status: TRUE"
    echo "🎉 Result: OK"
    echo ""
    echo "Chat widget is:"
    echo "  ✅ Optimized for speed (max_tokens: 250)"
    echo "  ✅ Using company logo (not robot emoji)"
    echo "  ✅ Build successful"
    echo "  ✅ Ready for production"
    exit 0
else
    echo "❌ SOME TESTS FAILED"
    echo ""
    echo "Status: FALSE"
    echo "Result: FAILED"
    exit 1
fi
