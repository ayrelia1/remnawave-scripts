# Selfsteal 2.14.1 verification

## Rejection-only admin sign-in

Template 5 replaces the material dashboard/editor with a standalone sign-in
screen and separate CSS/JS/SVG/manifest resources. The old editor route, scripts,
styles and article JSON are removed. All other template files are unchanged.

Regressions cover empty-field guidance, repeated invalid filled attempts, Enter
submission, show/hide masking, password clearing, retained username and focus.
Browser request observation checks zero submission requests and an unchanged
URL; cookies and web storage remain empty. The no-JavaScript form is disabled.
Static checks reject credential transport/storage/logging APIs in this script.

Shell/asset/installer-contract and transport suites pass. The updated browser
matrix contains 13 routes × 2 modes × 4 widths = 104 viewport cases, retaining
forum and 503 coverage. UI screenshots were inspected in both modes. A live
server installation was not run. This is presentation only, with no real login
or account service. The installer flow is unchanged; rollback is `671d0d2`.

The optional strict UI auditor reports 30 actionless-button findings because it
does not resolve the external addEventListener bindings. The raw findings and
browser-backed manual review are preserved in `selfsteal-ui-audit.json`.

## Historical 2.14.0 verification

# Selfsteal 2.14.0 verification

## 2026-10-31 forum, editorial cabinet and separate resources

This section supersedes the single-file distribution notes below. All eleven
repository directories are renamed, preserving numeric IDs. Each site has
separate HTML/CSS/JS/SVG/manifest resources and a checked `files.list`. There are
14 HTML pages, with nested forum/editorial routes and two local JSON datasets.

Template 2 is a forum with search, category filters, paginated topic list, thread,
new topic, replies and local persistence. Template 5 is an editorial cabinet with
derived counts, filtered/paginated material list and an editor. User input stays
literal, invalid fields receive focus, write failures preserve the form, and an
app-owned dialog handles dirty in-app navigation. No server admin, login, remote
publication or shared multi-user forum is added. Both 503 behaviors are retained.

Verified:

- Shell syntax, all external JS syntax, JSON, HTML/manifest references, exact
  inventories, and source scans for donor paths/runtime markers.
- 66 fixture installations: all 11 sites through actual git/API/curl functions
  in both modes. Full nested asset graphs are compared, inventories are removed,
  pretty API JSON works and a missing required stylesheet rejects installation.
- All existing repository suites plus the updated template suite.
- Chrome: 14 routes × 2 modes × 4 widths (1366, 768, 390, 320), 112 viewport
  checks. App flows cover create/edit material, create topic/reply, persistence,
  filtering, pagination, unsafe strings, long title/author, unsaved navigation,
  seed JSON failure/retry, corrupted/denied storage, keyboard and reduced motion.
- Both 503s: references, IP success/failure, manual/automatic retry, countdown
  and clipboard success/failure remain covered.

The installer contract test permits directory/display registries, presentation
mutation, validation and asset transports. Domain/port prompts, CLI parsing,
menus, service management, Caddy/Nginx configuration and method order still match
the original fork baseline. Transport validation is necessary for separate files;
no new installer questions or server settings are introduced.

The static UI auditor has 36 actionless-button findings because it only detects
inline event attributes. Scripts bind actual controls through addEventListener;
the browser suite exercises reachable actions and native dialogs. Raw findings
and the manual review are preserved in `selfsteal-ui-audit.json`; no clean strict
audit is claimed. Canonical ownership is in UX-CONTRACT.md and DESIGN.md.

No dependencies were installed. No live server installation, TLS probe or TSPU
recognition experiment was run. ShellCheck and the optional DESIGN.md CLI remain
unavailable. Rollback for this change is commit `cd86af3`.

## Historical 2.13.0 verification

# Selfsteal 2.13.0 verification

Verified locally on 2026-10-31. No server installation or deployment was run.

## Scope and installation contract

All eleven template directories now contain only a complete `index.html`.
Styles, scripts and distinct SVG icons are embedded; body content exists before
JavaScript runs. Old React distributions, external images/fonts, asset paths,
generator icons, source maps and per-site README files have been removed.

`tests/check-selfsteal-contract.js` compares the entire installer against fork
baseline `a318e2c8baf3e1a4b77b27b7a56dc349b36a711b`, normalizing only version,
source repository addresses, display names, presentation randomization, emergency
HTML bodies, and one precisely allowed Git working-directory repair. This
protects prompts, command parsing, main menu, domain/port/SSL handling, Caddy/Nginx
configuration, update logic and transport order from unintended changes.

The donor's Git method removed its temporary checkout while still inside it;
subsequent `find` operations failed with a deleted working directory. The single
added `cd "$HTML_DIR" || return 1` before cleanup restores the intended document
root. A reproducing fixture failed before this repair and now passes. No prompt,
flag or extra installer step was introduced.

The original API parser and curl resource list are retained. Compact API JSON is
tested directly; pretty JSON reaches the existing fallback. A single complete
HTML file makes that fallback sufficient, with no nested asset list or new
download protocol. A real GitHub API/network outage was not simulated on a live
server; transport network boundaries are replaced with local fixtures.

## Automated checks

- `bash -n selfsteal.sh` and all inline JavaScript syntax checks.
- `bash tests/run-tests.sh`: existing suites plus the new page/transport suite.
- `check-selfsteal-pages.js`: eleven distinct titles, synchronized Open Graph,
  readable main content, no external asset dependencies, donor runtime/path
  scan, complete single-file distributions and 503 reference/timer/IP presence.
- Actual production git/API/curl transport implementations: all 11 pages in
  both randomization modes (66 installs). Real permission setup is exercised
  against temporary fixtures; no Docker or system installation is run.
- Pretty API JSON reaches a complete curl fallback page without parser changes.
- Randomized title, visible site identity and social metadata remain consistent;
  obsolete hue-filter, synthetic IP endpoint and external IP URL are absent.

## Browser checks

Chrome/Playwright against actual transport outputs and independently randomized
copies: 11 sites × 2 modes × 4 viewport widths (1366, 768, 390, 320), 88 cases.

- No JavaScript exceptions, missing local resources or document overflow.
- Botanical filters, architectural disclosures, tea start/pause/reset/completion,
  valid/invalid recipe scaling, note save/reload and literal untrusted input,
  origami step boundaries, equal-color/black-white contrast calculation, every
  weekly day button and every planetary selection.
- Storage read/write denial, reduced motion, minimum control sizes, keyboard
  skip-link focus and readable no-JavaScript content.
- Both 503 references exist, remain stable until reload and change after manual
  and automatic reload. The countdown starts at five minutes and progresses;
  advancing wall time triggers the automatic retry.
- Clipboard copy success and denied-clipboard manual-selection recovery.
- IP success and network failure are mocked: base status pages request the IP;
  randomized pages make no IP request and keep working references/countdowns.
- Screenshots inspected for both 503 layouts on desktop/mobile and the nine
  ordinary layouts. All generated screenshots/profiles remain local artifacts.

## Static audit and limits

The scoped premium UI auditor reports 20 `affordance.actionless-button` findings.
It recognizes inline event attributes but not `addEventListener` bindings in the
embedded scripts. Every reported action was exercised in the browser. These are
reviewed false positives, not a claimed clean strict audit; the raw findings and
review are retained in `selfsteal-ui-audit.json`. Native select ownership is
explicit; no dummy handlers or disabled working controls were added for the audit.

No dependencies, frameworks, tools or CI gates were installed. ShellCheck and
the optional DESIGN.md CLI are unavailable and were not run. The numeric 503 is
page presentation: actual response status follows the unchanged server config.
IP and diagnostic references change rendered text, not downloaded source bytes.
Live TLS/HTTP probing and TSPU-recognition measurements were not performed.
New pages are public and can still be matched to this fork. Changed content is
not a guarantee of anonymity or non-recognition.

Rollback is the preceding commit `4746522`, which restores the original fork
contents. No production site or installed server CLI is changed by this local
verification; server updates require running the published installer/CLI.
