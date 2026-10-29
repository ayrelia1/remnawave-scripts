#!/usr/bin/env bash
# Test actual transport implementations against a local repository fixture.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR=$(mktemp -d)
trap 'rm -rf -- "$WORK_DIR"' EXIT
awk '
 /^# ===== TESTABLE-BLOCK: template-(download|transports|randomization) =====$/ { inside=1; next }
 /^# ===== END TESTABLE-BLOCK: template-(download|transports|randomization) =====$/ { inside=0 }
 inside { print }
' "$REPO_ROOT/selfsteal.sh" > "$WORK_DIR/code.sh"
source "$WORK_DIR/code.sh"
log_info() { :; }; log_success() { :; }; log_warning() { :; }; log_error() { :; }
show_download_summary() { :; }; setup_file_permissions() { :; }
create_dir_safe() { mkdir -p -- "$1"; }
WHITE='' GRAY='' GREEN='' NC=''
declare -A TEMPLATE_NAMES=()
export REPO_ROOT
node -e 'const fs=require("fs"),p=require("path");const root=process.env.REPO_ROOT;const tree=[];function walk(dir){for(const e of fs.readdirSync(p.join(root,dir),{withFileTypes:true})){const name=dir+"/"+e.name;tree.push({path:name,type:e.isDirectory()?"tree":"blob"});if(e.isDirectory())walk(name);}}walk("sni-templates");console.log(JSON.stringify({tree},null,2));' > "$WORK_DIR/tree.json"
copy_url() {
    local url="$1" output="$2" relative="${1#*/main/}"
    case "$url" in *api.github.com*) cat "$WORK_DIR/tree.json"; return ;; esac
    case "$relative" in *"${FAIL_ASSET:-never-match-file}"*) return 22 ;; esac
    [ -f "$REPO_ROOT/$relative" ] || return 22
    cp "$REPO_ROOT/$relative" "$output"
}
curl() {
    local url='' output=''
    while [ "$#" -gt 0 ]; do
        case "$1" in -o) output="$2"; shift 2 ;; --connect-timeout|--max-time) shift 2 ;; http*) url="$1"; shift ;; *) shift ;; esac
    done
    copy_url "$url" "$output"
}
wget() {
    local url='' output=''
    while [ "$#" -gt 0 ]; do
        case "$1" in -O) output="$2"; shift 2 ;; http*) url="$1"; shift ;; *) shift ;; esac
    done
    copy_url "$url" "$output"
}
for folder in 10gag convertit converter downloader filecloud games-site modmanager speedtest YouTube 503-1 503-2; do
    for transport in download_via_api download_via_curl_fallback; do
        HTML_DIR="$WORK_DIR/$folder-$transport"
        mkdir -p "$HTML_DIR"
        (cd "$HTML_DIR"; "$transport" "$folder")
        validate_template_files "$HTML_DIR"
        diff -qr "$REPO_ROOT/sni-templates/$folder" "$HTML_DIR" > /dev/null
        if [ -n "${SELFSTEAL_TEST_OUTPUT:-}" ] && [ "$transport" = download_via_curl_fallback ]; then
            mkdir -p "$SELFSTEAL_TEST_OUTPUT/$folder"
            cp -a "$HTML_DIR/." "$SELFSTEAL_TEST_OUTPUT/$folder/"
        fi
        echo "PASS: $folder: complete $transport download"
    done
done
HTML_DIR="$WORK_DIR/broken"
mkdir -p "$HTML_DIR"
FAIL_ASSET='assets/main.js'
if (cd "$HTML_DIR"; download_via_curl_fallback 503-2); then echo 'FAIL: incomplete download accepted'; exit 1; fi
if validate_template_files "$HTML_DIR"; then echo 'FAIL: missing JS accepted'; exit 1; fi
unset FAIL_ASSET
cp "$REPO_ROOT/sni-templates/503-2/assets/main.js" "$HTML_DIR/assets/main.js"
printf '<!doctype html><html>Error</html>' > "$HTML_DIR/assets/main.js"
if validate_template_files "$HTML_DIR"; then echo 'FAIL: HTML in JS asset accepted'; exit 1; fi
declare -A TEMPLATE_FOLDERS=([11]='503-2') TEMPLATE_NAMES=([11]='Juniper Status')
download_via_git() { return 1; }; download_via_api() { return 1; }; download_via_curl_fallback() { return 1; }
HTML_DIR="$WORK_DIR/existing"
mkdir -p "$HTML_DIR"
printf 'previous working site' > "$HTML_DIR/index.html"
if download_template 11; then echo 'FAIL: failed download reported success'; exit 1; fi
grep -q 'previous working site' "$HTML_DIR/index.html"
echo 'PASS: failed downloads preserve the previous site; missing or HTML-filled scripts rejected'
