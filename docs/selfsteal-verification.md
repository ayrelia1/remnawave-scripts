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
