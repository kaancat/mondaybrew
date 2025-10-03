#!/usr/bin/env bash
set -euo pipefail

# Fail if raw color values appear in components (use tokens instead)
if rg -n --no-heading -S \
  -e '#([0-9a-fA-F]{3,8})\b' \
  -e 'rgba?\(' \
  -e 'oklch\(' \
  web/src \
  --glob '!web/src/app/globals.css' \
  --glob '!**/*.json' ; then
  echo -e "\n[colors lint] Found raw color values in components. Use tokens." >&2
  exit 1
fi
exit 0

