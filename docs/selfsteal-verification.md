# Selfsteal Template Verification

## 2026-10-31 independent website replacement (2.12.0)

This section supersedes the earlier presentation-only verification below.
All eleven distributions have been replaced with authored HTML, CSS, JavaScript
and SVG. No old React bundles, image collections or original asset paths remain
in the current template directories. HTML includes body content before scripts
run. CSS/JS/SVG filenames are new; standard entry and manifest filenames remain.

The numbered choices remain 1–11 for command compatibility. The first nine are
a field guide, architectural notebook, tea timer, recipe calculator, reading
note, origami instruction, contrast tool, weekly tracker and planetary almanac.
The last two retain the 503 concept with newly authored layouts and scripts.
The emergency index and 404 content have also been rewritten.

### Installation and flags

Compared the install function, argument parser, server initialization,
Caddy/Nginx configuration generators and management-script installation against
donor commit `a318e2c8baf3e1a4b77b27b7a56dc349b36a711b`. These sections are
unchanged apart from template display names. The pinned comparison is enforced
by `tests/check-selfsteal-flow.js`. This is source-level contract verification,
not a fresh installation on a Linux production server.

`install` retains the domain/configuration prompts. `template` only changes the
site in an existing installation and does not ask for a domain. Running a fresh
script with `template` does not replace the installed CLI. Fixed the Selfsteal
quick-start URLs in both main READMEs to use this fork.

Default installation still varies presentation once at install/change time;
`--no-randomize` still preserves authored presentation and allows IP requests on
the status pages. The implementation varies semantic CSS colors and each site's
SVG rather than injecting the donor's whole-page filter, common favicon and noise
comments. It disables IP lookup without requesting a synthetic endpoint. IDs,
CLI flags, server configuration and the previous download-validation fixes remain.

### Checks

- Full shell test suite, shell syntax and JavaScript syntax checks.
- Actual API and curl download implementations tested against local fixtures
  for all eleven sites; inventories and missing/HTML-filled asset rejection.
- Failure preserves the existing site; `files.list` is removed before serving.
- All 11 sites in both modes at 1366, 768, 390 and 320px: 88 viewport cases.
- No browser exceptions, missing local resources or horizontal overflow.
- Tea timer start/pause/reset/completion; valid/invalid recipe scaling; botanical
  filtering; native architectural disclosures; note persistence and literal
  untrusted text; origami boundaries; black/white and equal-color contrast;
  all weekday and planet controls.
- Keyboard skip-link focus, reduced motion and readable no-JavaScript content.
- Blocked storage read/write and failed optional IP lookup.
- Mocked IP lookup is requested only by base status pages, never by randomized
  pages; no other external requests are made by the distributions.

The strict static UI auditor reports 18 `affordance.actionless-button` findings:
it recognizes inline handlers but not external `addEventListener` bindings.
Every reported button is connected and exercised in the browser suite. The raw
findings and review are retained in `selfsteal-ui-audit.json`; this is not reported
as a clean static audit. Scope is `sni-templates`, with explicit native select
ownership; local ignored fixtures are excluded. No dummy inline handlers were
added to silence the findings.

No dependency, framework installation, CI gate or runtime installation was added.
ShellCheck and the optional DESIGN.md CLI are unavailable locally and were not
run. No live server installation, TLS/HTTP probing or censorship-recognition
measurements were performed. New content does not guarantee non-recognition:
these sites are also public, and server/network behavior is deliberately retained.

Rollback: use the preceding Git revision's script and collection together, or
restore the server's template backup. No production installation or remote
infrastructure was modified during verification.

## Historical verification of the previous collection

Verified locally on 2026-10-29. These checks did not install or deploy services
on a server.

## Automated checks

- `bash -n selfsteal.sh`: passed.
- `bash tests/run-tests.sh`: passed all suites, including the new Selfsteal suite.
- `bash tests/test-selfsteal-templates.sh`: all eleven templates passed metadata
  synchronization, IP lookup neutralization, source preservation and independent
  installation checks. Git, API and curl download selection were exercised with
  local file-copy boundaries in both randomization modes.
- `node tests/check-selfsteal-template-assets.js`: all HTML and manifest references,
  icon dimensions and all twelve JavaScript bundle syntax checks passed.
- Strict premium UI audit: zero findings; see `selfsteal-ui-audit.json`.
- `git diff --check`: passed.
- Token comparison against the starting revision: all twelve JavaScript bundles
  preserve executable token sequences; 614 string literal values changed.

## Browser verification

Chrome was used for all eleven authored sites and eleven installation-randomized
copies at 1366px and 390px widths: 44 viewport cases. Each rendered without a
JavaScript exception, missing local resources or document-level horizontal
overflow. Reduced-motion handling and keyboard focus entry were checked.

Eleven interaction checks passed:

- Sidewalk: populated feed, category filtering and theme switching.
- Cutlane: account dialog and its existing local error path.
- Formatwell: file selection, opening the format menu, selecting DOCX and cancel.
- Parcelink: media selection, automatic-quality toggle and manual quality select.
- Foliohaven: the existing account error path.
- Cartridge Club: search, empty results, restored collection and invitation entry.
- Patchbay: invitation dialog and the existing invalid-invitation response.
- LineMeter: simulated measurement, error and retry state.
- Кадротека: opening a video, verification dialog and IP display.
- Harbor Queue and Juniper Status: countdown progression.

For the three sites that query IP, the authored version made the expected API
request and displayed a controlled test response. Randomized copies made no
external IP request. Both status pages handled an unavailable IP API using their
existing fallback text.

External IP and image requests were intercepted during these checks. External
service availability and live transfer speeds were not validated.

## Limits and publication

The pages retain their original demonstration behavior. Actual account, file
processing and storage services are not supplied. Server configuration and TLS
behavior were not changed or tested against a live deployment. Content changes
do not establish resistance to traffic or website classification.

ShellCheck and the official DESIGN.md CLI were not installed; no dependencies
were added to run them. Bash syntax, the project tests and the available UI audit
were run instead. The repository has no frontend build or source-generation
command for the prebuilt template bundles.

Publish the local changes to the fork before installing from its GitHub URL.
Existing installations need their template reinstalled to receive the new files.

## 2026-10-30 download and layout regression checks

- Fixed the Harbor Queue outer flex alignment; browser checks assert horizontal
  centering at both widths and vertical centering when the card fits the viewport.
- Exercised the actual API and curl transport code against local fixtures for all
  eleven distributions, including nested and hashed asset names and game images.
- Confirmed pretty-printed GitHub JSON skips directory entries, missing scripts
  and HTML responses masquerading as scripts are rejected, and failed downloads
  preserve a working site.
- Rendered the curl-downloaded distributions in Chrome in both mutation modes
  at 1366px and 390px: all 44 viewport cases passed with no JavaScript exceptions
  or missing local assets. External media/IP endpoints were controlled fixtures.
- Added stable authored CSS/JS version queries; randomization still replaces them.
- Server deployment remains untested; these checks use isolated local copies.
