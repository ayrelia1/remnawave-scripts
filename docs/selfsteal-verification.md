# Selfsteal Template Verification

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
