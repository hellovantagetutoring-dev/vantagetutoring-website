#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-8765}"
HOST="${HOST:-127.0.0.1}"

cd "$ROOT"

if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Preview already running at http://${HOST}:${PORT}/"
  exit 0
fi

echo "Starting Vantage local preview…"
echo "  Home:    http://${HOST}:${PORT}/"
echo "  Tutors:  http://${HOST}:${PORT}/tutors/"
echo "  Contact: http://${HOST}:${PORT}/contact/"
echo ""
echo "Stop with Ctrl+C"

exec python3 -m http.server "$PORT" --bind "$HOST"
