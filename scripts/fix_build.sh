#!/bin/bash
echo "🧹 Cleaning build artifacts..."
rm -rf .next .open-next out dist

echo "♻️  Reinstalling dependencies (clean)..."
rm -rf node_modules
npm install

echo "✨ Ready! Please run 'npm run dev' to test the UI."
