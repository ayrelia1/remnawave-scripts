#!/usr/bin/env bash
# Exercise the original transport functions against complete local page fixtures.
set -euo pipefail
REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
WORK_DIR=$(mktemp -d)
trap 'rm -rf -- "$WORK_DIR"' EXIT
awk '/^randomize_template\(\)/ { active=1 } /^# Функция для установки правильных прав доступа/ { active=0 } active { print }' "$REPO_ROOT/selfsteal.sh" > "$WORK_DIR/code.sh"
source "$WORK_DIR/code.sh"
awk '/^setup_file_permissions\(\)/ { active=1 } /^# Функция для показа итогов скачивания/ { active=0 } active { print }' "$REPO_ROOT/selfsteal.sh" > "$WORK_DIR/permissions.sh"
source "$WORK_DIR/permissions.sh"
log_info(){ :; }; log_warning(){ :; }; log_success(){ :; }; log_error(){ :; }
create_dir_safe(){ mkdir -p -- "$1"; }; show_download_summary(){ :; }; create_fallback_html(){ return 1; }
WHITE='' GRAY='' GREEN='' NC=''
folders=(10gag convertit converter downloader filecloud games-site modmanager speedtest YouTube 503-1 503-2)
declare -A TEMPLATE_FOLDERS=() TEMPLATE_NAMES=()
for i in "${!folders[@]}"; do TEMPLATE_FOLDERS[$((i+1))]="${folders[$i]}"; TEMPLATE_NAMES[$((i+1))]="${folders[$i]}"; done
copy_url(){
    local url="$1" output="$2" relative="${1#*/main/}"
    case "$url" in *api.github.com*)
        # The original parser accepts compact JSON; the pretty JSON path must
        # still reach curl fallback successfully without modifying the parser.
        if [ "${PRETTY_API:-false}" = true ]; then printf '{"tree": [{"path": "sni-templates/10gag/index.html", "type": "blob"}]}';
        else printf '{"tree":['; for folder in "${folders[@]}"; do printf '{"path":"sni-templates/%s/index.html","type":"blob"},' "$folder"; done; printf '{}]}'; fi
        return;; esac
    [ -f "$REPO_ROOT/$relative" ] || return 22
    cp "$REPO_ROOT/$relative" "$output"
}
curl(){
    local url='' output=''
    while [ "$#" -gt 0 ]; do case "$1" in -o) output="$2"; shift 2;; http*) url="$1"; shift;; *) shift;; esac; done
    if [ "$METHOD" = git ]; then return 22; fi
    copy_url "$url" "$output"
}
wget(){
    [ "$METHOD" = api ] || return 1
    local url='' output=''
    while [ "$#" -gt 0 ]; do case "$1" in -O) output="$2"; shift 2;; http*) url="$1"; shift;; *) shift;; esac; done
    copy_url "$url" "$output"
}
git(){
    [ "$METHOD" = git ] || return 1
    case "$1" in clone)
        local destination="${@: -1}"
        mkdir -p "$destination/sni-templates"
        cp -R "$REPO_ROOT/sni-templates/." "$destination/sni-templates/";;
        sparse-checkout) return 0;; *) return 1;; esac
}
for METHOD in git api curl; do
  for id in {1..11}; do
    folder="${TEMPLATE_FOLDERS[$id]}"
    HTML_DIR="$WORK_DIR/$METHOD-$id"
    RANDOMIZE_TEMPLATE=false
    download_template "$id" > /dev/null
    test -d . # Regression: the Git transport must not leave a deleted cwd.
    cmp "$REPO_ROOT/sni-templates/$folder/index.html" "$HTML_DIR/index.html"
    if [ "$METHOD" = curl ] && [ -n "${SELFSTEAL_TEST_OUTPUT:-}" ]; then
      mkdir -p "$SELFSTEAL_TEST_OUTPUT/$folder"; cp "$HTML_DIR/index.html" "$SELFSTEAL_TEST_OUTPUT/$folder/"
    fi
    RANDOMIZE_TEMPLATE=true
    download_template "$id" > /dev/null
    test -s "$HTML_DIR/index.html"
    if grep -q 'api.ipify.org\|hue-rotate\|/_s/ip' "$HTML_DIR/index.html"; then echo "FAIL: obsolete presentation output"; exit 1; fi
    grep -q -- '--accent:hsl(' "$HTML_DIR/index.html"
    title=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' "$HTML_DIR/index.html")
    grep -Fq "property=\"og:title\" content=\"$title\"" "$HTML_DIR/index.html"
    grep -Fq "<span data-site-name>$title</span>" "$HTML_DIR/index.html"
    if [ "$METHOD" = curl ] && [ -n "${SELFSTEAL_TEST_RANDOM_OUTPUT:-}" ]; then
      mkdir -p "$SELFSTEAL_TEST_RANDOM_OUTPUT/$folder"; cp "$HTML_DIR/index.html" "$SELFSTEAL_TEST_RANDOM_OUTPUT/$folder/"
    fi
    echo "PASS: $METHOD/$folder: original transport, complete page and both randomization modes"
  done
done
METHOD=curl PRETTY_API=true RANDOMIZE_TEMPLATE=false
HTML_DIR="$WORK_DIR/pretty-api"
download_template 1 > /dev/null
cmp "$REPO_ROOT/sni-templates/10gag/index.html" "$HTML_DIR/index.html"
echo 'PASS: original API parser falls back to a complete self-contained HTML page'
cd "$REPO_ROOT"
node tests/check-selfsteal-pages.js
node tests/check-selfsteal-contract.js
