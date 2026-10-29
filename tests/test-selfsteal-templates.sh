#!/usr/bin/env bash
# Exercise template mutation without running the installer or contacting a server.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/selfsteal-templates.XXXXXX")"
trap 'rm -rf -- "$WORK_DIR"' EXIT

awk '
    $0 ~ /^# ===== TESTABLE-BLOCK: template-(randomization|download) =====$/ { inside = 1; next }
    $0 ~ /^# ===== END TESTABLE-BLOCK: template-(randomization|download) =====$/ { inside = 0 }
    inside { print }
' "$REPO_ROOT/selfsteal.sh" > "$WORK_DIR/randomize.sh"
test -s "$WORK_DIR/randomize.sh"
# shellcheck source=/dev/null
source "$WORK_DIR/randomize.sh"
log_info() { :; }
log_success() { :; }
WHITE='' GRAY='' NC=''

for template in 10gag convertit converter downloader filecloud games-site modmanager speedtest YouTube 503-1 503-2; do
    mkdir -p "$WORK_DIR/$template"
    cp -R "$REPO_ROOT/sni-templates/$template/." "$WORK_DIR/$template/"
    randomize_template "$WORK_DIR/$template"

    html="$WORK_DIR/$template/index.html"
    title=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' "$html")
    description=$(sed -n 's/.*name="description" content="\([^"]*\)".*/\1/p' "$html")
    brand=$(sed -n 's/.*name="application-name" content="\([^"]*\)".*/\1/p' "$html")
    grep -Fq "property=\"og:title\" content=\"$title\"" "$html" || { echo "FAIL: $template: stale Open Graph title"; exit 1; }
    grep -Fq "property=\"og:description\" content=\"$description\"" "$html" || { echo "FAIL: $template: stale Open Graph description"; exit 1; }
    grep -Fq "\"name\": \"$brand\"" "$WORK_DIR/$template/site.webmanifest" || { echo "FAIL: $template: stale manifest name"; exit 1; }
    if grep -Rq 'api\.ipify\.org' "$WORK_DIR/$template"; then echo "FAIL: $template: external IP request survived mutation"; exit 1; fi
    if find "$WORK_DIR/$template" -iname '*.md' -o -iname '*.map' | grep -q .; then echo "FAIL: $template: development files survived mutation"; exit 1; fi
    grep -q 'hue-rotate(' "$html"
    grep -Eq '(src|href)="[^"]+\.(css|js)\?v=[^"]+"' "$html"
    echo "PASS: $template: metadata, IP handling, assets and color mutation"
done

# Each invocation creates a distinct installation; the source copy stays pristine.
cp "$WORK_DIR/503-2/index.html" "$WORK_DIR/first.html"
randomize_template "$WORK_DIR/503-2"
if cmp -s "$WORK_DIR/first.html" "$WORK_DIR/503-2/index.html"; then echo 'FAIL: repeated mutation produced identical HTML'; exit 1; fi
for template in YouTube 503-1 503-2; do
    grep -Rq 'https://api\.ipify\.org' "$REPO_ROOT/sni-templates/$template"
    if grep -q 'hue-rotate(' "$REPO_ROOT/sni-templates/$template/index.html"; then echo "FAIL: $template: source is already randomized"; exit 1; fi
done
echo 'PASS: independent installs differ and base templates preserve IP requests'

# All download methods must honor --no-randomize, not just direct mutation tests.
declare -A TEMPLATE_FOLDERS=([11]="503-2")
declare -A TEMPLATE_NAMES=([11]="Juniper Status")
create_dir_safe() { mkdir -p -- "$1"; }
setup_file_permissions() { :; }
copy_fixture() { cp -R "$REPO_ROOT/sni-templates/$1/." "$HTML_DIR/"; }
download_via_git() { [ "$DOWNLOAD_METHOD" = git ] && copy_fixture "$1"; }
download_via_api() { [ "$DOWNLOAD_METHOD" = api ] && copy_fixture "$1"; }
download_via_curl_fallback() { [ "$DOWNLOAD_METHOD" = curl ] && copy_fixture "$1"; }
for DOWNLOAD_METHOD in git api curl; do
    HTML_DIR="$WORK_DIR/download-$DOWNLOAD_METHOD"
    RANDOMIZE_TEMPLATE=false
    download_template 11 > /dev/null
    diff -qr "$REPO_ROOT/sni-templates/503-2" "$HTML_DIR" > /dev/null
    RANDOMIZE_TEMPLATE=true
    download_template 11 > /dev/null
    if grep -Rq 'api\.ipify\.org' "$HTML_DIR"; then echo "FAIL: $DOWNLOAD_METHOD: default download kept the external IP lookup"; exit 1; fi
    grep -q 'hue-rotate(' "$HTML_DIR/index.html"
    echo "PASS: $DOWNLOAD_METHOD download honors both randomization modes"
done

if command -v node >/dev/null 2>&1; then
    node "$REPO_ROOT/tests/check-selfsteal-template-assets.js"
else
    echo 'SKIP: template asset validation requires Node.js'
fi
