#!/usr/bin/env bash
# Phased corpus:generate for Republic Book I (Perseus pages 327–354).
set -euo pipefail
cd "$(dirname "$0")/.."

LOG=".local/corpus/generate-republic-book-1.log"
mkdir -p .local/corpus

run_phase() {
  local name="$1"
  shift
  local citations=("$@")
  echo "" | tee -a "$LOG"
  echo "========== Phase: $name ==========" | tee -a "$LOG"
  for c in "${citations[@]}"; do
    echo "--- Republic $c ($(date -Iseconds)) ---" | tee -a "$LOG"
    if pnpm corpus:generate -- --work-slug=republic --citation="$c" 2>&1 | tee -a "$LOG"; then
      echo "OK $c" | tee -a "$LOG"
    else
      echo "FAILED $c (continuing)" | tee -a "$LOG"
    fi
    sleep 2
  done
}

echo "Republic Book I generation started $(date -Iseconds)" | tee "$LOG"

run_phase "A opening–Cephalus" 327 328 329 330 331
run_phase "B Polemarchus–Simonides" 332 333 334 335 336
run_phase "C Thrasymachus" 337 338 339 340 341 342 343 344 345 346 347 348 349 350 351 352 353 354

echo "" | tee -a "$LOG"
echo "Done $(date -Iseconds)" | tee -a "$LOG"
echo "Log: $LOG"
