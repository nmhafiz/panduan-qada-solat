#!/bin/bash
PROJECT_NAME="panduan-qada-solat"
echo "Uploading secrets to Cloudflare Pages project: $PROJECT_NAME"

while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  if [ -n "$key" ] && [ -n "$value" ]; then
    echo "Setting secret: $key"
    echo "$value" | npx wrangler pages secret put "$key" --project-name "$PROJECT_NAME"
  fi
done < .env.local
echo "Done!"
