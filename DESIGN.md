# Independent Website Collection

## Overview

Eleven independent Russian-language sites live in `sni-templates/`. Seven are
reference/browser tools, one is a sign-in screen, one a forum, and two retain
the 503 service-unavailable concept. Each has separate HTML, CSS, JavaScript,
SVG icons and an application manifest; the forum also loads local JSON. There is no shared public
brand, framework runtime, backend service, remote font or media CDN.

The subject determines the layout: a botanical specimen grid, discussion
board, tea desk, recipe ledger, centered access card, paper-fold lesson, contrast
specimen, weekly calendar, orbital map and two distinct service-status sheets.
The access form intentionally rejects every attempt. No uploads, invented service
metrics or unimplemented controls are included.

## Colors

Model B: each primary stylesheet owns its canonical `:root` tokens. Components consume `--paper`, `--ink`, `--accent` and `--wash`.
This table mirrors the authored token values; there are no theme adapters.

| ID | Folder / subject | Paper | Ink | Accent | Wash |
|---|---|---|---|---|---|
| 1 | `bracken` / Bracken Fieldbook | #f1f5ec | #22382b | #416b43 | #dce7d5 |
| 2 | `courtyard` / Клуб Практика | #f6f4f8 | #49365b | #76508c | #e6deec |
| 3 | `steep-hour` / Steep Hour | #f7f0e5 | #43372d | #85512d | #e9dcc5 |
| 4 | `spoon-ratio` / Spoon Ratio | #fff4e8 | #493124 | #9b4328 | #f3ddc6 |
| 5 | `editorial` / Folio Access | #f1f4f7 | #22333e | #245d75 | #dae4ec |
| 6 | `fold-studies` / Fold Studies | #e9f3f7 | #243e55 | #23628d | #cee1eb |
| 7 | `chroma-deck` / Chroma Deck | #f0f0f4 | #282d42 | #535d9d | #dcdfea |
| 8 | `seven-days` / Seven Small Days | #eef4ee | #293f38 | #456c58 | #dce8dd |
| 9 | `orbit-almanac` / Orbit Almanac | #151d35 | #e7edf9 | #a8bbef | #242f4e |
| 10 | `slate-status` / Slate Workshop | #f0f2f5 | #263747 | #456880 | #dde4ec |
| 11 | `still-status` / Still Service | #f5eef6 | #43374f | #735280 | #e8dced |

At installation the randomizer varies semantic palette tokens while preserving
light/dark contrast, title/description/application identity, visible logo labels,
Open Graph metadata, icon colors and a version token. It does not inject a
whole-document filter, a common favicon or synthetic IP endpoint. Body content
and interaction contracts remain fixed. `--no-randomize` preserves authored HTML.

## Typography

Body and access page: Segoe UI/Arial/system sans; botanical, tea, recipe and 503 display:
Georgia; forum, fold, weekly and orbital display: Trebuchet MS; technical values:
Consolas. Each heading has a subject-specific scale.
All stacks support Cyrillic without network requests and wrap naturally.

## Layout

Each site has an authored entry document, separate presentation/behavior/identity
files and `site.webmanifest`. The forum has `community/{styles,scripts,records}`
and `discussions/{thread,new}.html`; template 5 has `access/{styles,scripts}` and a separate identity mark. All repository folder names have been replaced;
the numeric template IDs remain stable. No remote fonts or media are required.
`files.list` is a checked download inventory, removed before serving the site.
All transports require the complete inventory, including nested files.

Template 5 is a restrained private-access page: a centered form, small local
brand mark, login/password fields and a stable inline error region. Any filled
submission rejects, clears and remasks the password, retains the username only
in the current DOM and focuses the password field. Its script has no network,
storage, cookie or logging code. The disabled-by-default fieldset prevents
no-JavaScript submissions; inputs have no name attributes. There is no editor,
cabinet dataset or successful-login destination.

The forum uses a plum discussion board, a compact category sidebar and a single-
column thread. Its route, persistence, retry and unsaved-navigation behavior is
defined in [UX-CONTRACT.md](UX-CONTRACT.md).

Normal document scrolling owns every page. Two-column layouts collapse at
650–750px; small controls and long references must remain inside a 320px viewport.
Status cards center within their available document width and grow naturally
when their contents exceed a viewport. Footers stay in flow. Reduced motion,
global scrollbar styling, forced colors and visible keyboard focus are defined
in every site's primary stylesheet.

## Elevation & Depth

Use borders and flat tinted panels. The access page and forum use subtle panel borders rather than floating overlays. No decorative glow or animated backgrounds.

## Shapes

Keep subject-specific marks: leaf, stairs, cup, plate, letter F, paper boat,
overlapping circles, calendar, orbit and two distinct service symbols. Inline
diagrams are decorative and clearly described; orbital distances are not to scale.

## Components

The templates are independent sites; forum routes share their own
application controllers. Native HTML
controls own selection/disclosure/input behavior; their operating-system popup
geometry is accepted. No shared app component or build dependency is introduced.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select | Labeled fields in page HTML | Botanical filter, tea type | Browser selected/open states |
| Form | Native inputs and page handlers | Application script and UX-CONTRACT.md | Recipe input, goal, sign-in, topic, reply | Valid/invalid, reload and blocked storage |
| Scrollbar | Document primary stylesheet | `html` and scrollbar pseudo-elements | Document and textarea overflow | Narrow layouts and CSS inspection |

All native actions have hover, pressed, focus and disabled states. Feedback uses
reserved inline `role=status` space; sign-in errors use `role=alert`. Skip links
move focus to the main landmark. Forum routes share app-owned dialog behavior.
There are no toasts, destructive actions, authentication or remote CRUD.

Forum records and weekly marks are bounded localStorage data, with read/parse/
write failures handled. User strings are assigned to textContent or input values,
never interpreted as HTML. The tea timer uses wall time with pause/reset and
completion feedback. Recipe scaling preserves its last valid result on invalid
input. Origami steps also exist in a native disclosure without JavaScript.

Both 503 pages preserve the original five-minute automatic reload, manual reload,
visitor IP lookup and a unique per-load reference. New code generates diagnostic
references with browser randomness, not authentication secrets. IDs change on
reload, remain stable while the page is open, wrap on narrow screens and can be
copied, with manual-selection recovery if the clipboard is unavailable. The IP
lookup has a four-second timeout and safe fallback. Default randomization disables
the external lookup, as the donor did; `--no-randomize` keeps it. A client-side
reference/IP changes rendered text, not the downloaded HTML source. The 503
number is presentation content; HTTP serving configuration remains the donor's.

## Do's and Don'ts

- Keep install prompts, CLI commands/flags, template IDs, server config and menu.
- Keep assets separately named and listed in files.list; verify git/API/curl completeness.
- The one transport repair returns to the HTML directory before deleting Git's
  temporary checkout; no interactive flow or network order changes.
- Check authored and randomized installs, 320/390/768/1366px layouts, IP/clipboard/
  storage failure, no-JS content and 503 retry/reference behavior.
- Keep license and origin attribution in repository documentation.
- Public pages can be matched to a public fork; no anonymity or censorship-
  resistance guarantee is implied by changed metadata or file hashes.
