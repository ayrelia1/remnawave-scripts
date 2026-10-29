#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source <(awk '
 $0 == "# ===== TESTABLE-BLOCK: template-randomization =====" { inside=1; next }
 $0 == "# ===== END TESTABLE-BLOCK: template-randomization =====" { inside=0 }
 inside { print }
' selfsteal.sh)
log_info() { :; }
log_success() { :; }
mkdir -p .selfsteal-work/randomized
for name in 10gag convertit converter downloader filecloud games-site modmanager speedtest YouTube 503-1 503-2; do
 mkdir -p ".selfsteal-work/randomized/$name"
 cp -R "sni-templates/$name/." ".selfsteal-work/randomized/$name/"
 randomize_template ".selfsteal-work/randomized/$name"
done
echo 'Created 11 randomized local copies.'
