#!/bin/bash
set -e
cd /workspace/frontend/callwaitingai-frontend
echo "Building frontend..."
export PATH=/usr/local/bin:$PATH
/usr/local/bin/node node_modules/vite/bin/vite.js build
echo "Build complete! Checking dist folder..."
ls -lh dist/
