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
folders=(bracken courtyard steep-hour spoon-ratio editorial fold-studies chroma-deck seven-days orbit-almanac slate-status still-status)
declare -A TEMPLATE_FOLDERS=() TEMPLATE_NAMES=()
for i in "${!folders[@]}"; do TEMPLATE_FOLDERS[$((i+1))]="${folders[$i]}"; TEMPLATE_NAMES[$((i+1))]="${folders[$i]}"; done
export REPO_ROOT
node -e 'const fs=require("fs"),p=require("path");let tree=[];function walk(dir){for(const e of fs.readdirSync(p.join(process.env.REPO_ROOT,dir),{withFileTypes:true})){const name=dir+"/"+e.name;if(e.isDirectory())walk(name);else tree.push({path:name,type:"blob"});}}walk("sni-templates");fs.writeFileSync(process.argv[1],JSON.stringify({tree}));fs.writeFileSync(process.argv[2],JSON.stringify({tree},null,2));' "$WORK_DIR/compact.json" "$WORK_DIR/pretty.json"
copy_url(){
    local url="$1" output="$2" relative="${1#*/main/}"
    case "$url" in *api.github.com*)
        if [ "${PRETTY_API:-false}" = true ]; then cat "$WORK_DIR/pretty.json"; else cat "$WORK_DIR/compact.json"; fi
        return;; esac
    case "$relative" in *"${FAIL_ASSET:-never-match-fixture}"*) return 22;; esac
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
    diff -qr --exclude=files.list "$REPO_ROOT/sni-templates/$folder" "$HTML_DIR" > /dev/null
    test ! -e "$HTML_DIR/files.list"
    if [ "$METHOD" = curl ] && [ -n "${SELFSTEAL_TEST_OUTPUT:-}" ]; then
      mkdir -p "$SELFSTEAL_TEST_OUTPUT/$folder"; cp -a "$HTML_DIR/." "$SELFSTEAL_TEST_OUTPUT/$folder/"
    fi
    RANDOMIZE_TEMPLATE=true
    download_template "$id" > /dev/null
    test -s "$HTML_DIR/index.html"
    if grep -Rq 'api.ipify.org\|hue-rotate\|/_s/ip' "$HTML_DIR"; then echo "FAIL: obsolete presentation output"; exit 1; fi
    grep -Rq -- '--accent:hsl(' "$HTML_DIR"
    title=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' "$HTML_DIR/index.html")
    grep -Fq "property=\"og:title\" content=\"$title\"" "$HTML_DIR/index.html"
    grep -Fq "<span data-site-name>$title</span>" "$HTML_DIR/index.html"
    if [ "$METHOD" = curl ] && [ -n "${SELFSTEAL_TEST_RANDOM_OUTPUT:-}" ]; then
      mkdir -p "$SELFSTEAL_TEST_RANDOM_OUTPUT/$folder"; cp -a "$HTML_DIR/." "$SELFSTEAL_TEST_RANDOM_OUTPUT/$folder/"
    fi
    echo "PASS: $METHOD/$folder: original transport, complete page and both randomization modes"
  done
done
METHOD=api PRETTY_API=true RANDOMIZE_TEMPLATE=false
HTML_DIR="$WORK_DIR/pretty-api"
download_template 1 > /dev/null
diff -qr --exclude=files.list "$REPO_ROOT/sni-templates/bracken" "$HTML_DIR" > /dev/null
echo 'PASS: pretty API JSON downloads the complete asset graph'
METHOD=curl FAIL_ASSET='presentation/fieldbook.css'
HTML_DIR="$WORK_DIR/incomplete"
if download_template 1 > /dev/null; then echo 'FAIL: incomplete asset graph accepted'; exit 1; fi
unset FAIL_ASSET
echo 'PASS: missing required CSS prevents a successful installation'
cd "$REPO_ROOT"
node tests/check-selfsteal-pages.js
node tests/check-selfsteal-contract.js
