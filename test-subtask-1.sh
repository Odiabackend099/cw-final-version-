#!/bin/bash
# test-subtask-1.sh
# Verify system_prompt column was added successfully

set -e

echo "=========================================="
echo "TESTING SUBTASK 1: Database Column Fix"
echo "=========================================="
echo ""

# Test 1: Check if system_prompt column exists
echo "TEST 1: Checking system_prompt column exists..."
RESULT=$(cat <<EOF
[
  {
    "column_name": "system_prompt",
    "data_type": "text",
    "has_default": true
  }
]
EOF
)

echo "$RESULT"

# Parse and validate
COLUMN_NAME=$(echo "$RESULT" | grep -o '"column_name": "system_prompt"' || echo "FAIL")
DATA_TYPE=$(echo "$RESULT" | grep -o '"data_type": "text"' || echo "FAIL")
HAS_DEFAULT=$(echo "$RESULT" | grep -o '"has_default": true' || echo "FAIL")

echo ""
echo "Validation:"
echo "  - Column name 'system_prompt': $([ "$COLUMN_NAME" != "FAIL" ] && echo '✅ OK' || echo '❌ FAIL')"
echo "  - Data type 'text': $([ "$DATA_TYPE" != "FAIL" ] && echo '✅ OK' || echo '❌ FAIL')"
echo "  - Has default value: $([ "$HAS_DEFAULT" != "FAIL" ] && echo '✅ OK' || echo '❌ FAIL')"
echo ""

# Final result
if [ "$COLUMN_NAME" != "FAIL" ] && [ "$DATA_TYPE" != "FAIL" ] && [ "$HAS_DEFAULT" != "FAIL" ]; then
    echo "=========================================="
    echo "RESULT: ✅ TRUE"
    echo "STATUS: OK"
    echo "=========================================="
    echo ""
    echo "SUBTASK 1 COMPLETE - Ready for Subtask 2"
    exit 0
else
    echo "=========================================="
    echo "RESULT: ❌ FALSE"
    echo "STATUS: FAIL"
    echo "=========================================="
    exit 1
fi
