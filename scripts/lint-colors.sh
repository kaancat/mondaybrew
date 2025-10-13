#!/usr/bin/env bash
set -euo pipefail

# Fail if raw color values appear in components (use tokens instead)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_DIR="${ROOT_DIR}/src"

# If the src directory doesn't exist (e.g. during partial installs), skip gracefully.
if [[ ! -d "${TARGET_DIR}" ]]; then
  exit 0
fi

pushd "${ROOT_DIR}" >/dev/null
if rg -n --no-heading -S \
  -e '#([0-9a-fA-F]{3,8})\b' \
  src/components src/app \
  --glob '!src/app/globals.css' \
  --glob '!**/*.json' ; then
  echo -e "\n[colors lint] Found raw color values in components. Use tokens." >&2
  popd >/dev/null
  exit 1
fi
popd >/dev/null
exit 0
