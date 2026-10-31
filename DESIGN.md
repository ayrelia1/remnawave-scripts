# Self-contained Website Collection

## Overview

Eleven independent Russian-language sites live in `sni-templates/`. Nine are
useful reference or browser tools; two retain the 503 service-unavailable
concept. All are complete authored HTML documents. There is no shared public
brand, framework runtime, backend service, remote font or media CDN.

The subject determines the layout: a botanical specimen grid, architectural
notebook, tea desk, recipe ledger, reading shelf, paper-fold lesson, contrast
specimen, weekly calendar, orbital map and two distinct service-status sheets.
No fake account forms, uploads, invented service metrics or unimplemented actions.

## Colors

Model B: each `index.html` owns its canonical `:root` tokens in its embedded
stylesheet. Components consume `--paper`, `--ink`, `--accent` and `--wash`.
This table mirrors the authored token values; there are no theme adapters.

| ID | Folder / subject | Paper | Ink | Accent | Wash |
|---|---|---|---|---|---|
| 1 | `10gag` / Bracken Fieldbook | #f1f5ec | #22382b | #416b43 | #dce7d5 |
| 2 | `convertit` / Bayline Notes | #edf1f6 | #21394b | #285d8e | #d9e4ef |
| 3 | `converter` / Steep Hour | #f7f0e5 | #43372d | #85512d | #e9dcc5 |
| 4 | `downloader` / Spoon Ratio | #fff4e8 | #493124 | #9b4328 | #f3ddc6 |
| 5 | `filecloud` / Margin Shelf | #efedf7 | #302a50 | #68559c | #ded8ef |
| 6 | `games-site` / Fold Studies | #e9f3f7 | #243e55 | #23628d | #cee1eb |
| 7 | `modmanager` / Chroma Deck | #f0f0f4 | #282d42 | #535d9d | #dcdfea |
| 8 | `speedtest` / Seven Small Days | #eef4ee | #293f38 | #456c58 | #dce8dd |
| 9 | `YouTube` / Orbit Almanac | #151d35 | #e7edf9 | #a8bbef | #242f4e |
| 10 | `503-1` / Slate Workshop | #f0f2f5 | #263747 | #456880 | #dde4ec |
| 11 | `503-2` / Still Service | #f5eef6 | #43374f | #735280 | #e8dced |

At installation the randomizer varies semantic palette tokens while preserving
light/dark contrast, title/description/application identity, visible logo labels,
Open Graph metadata, icon colors and a version token. It does not inject a
whole-document filter, a common favicon or synthetic IP endpoint. Body content
and interaction contracts remain fixed. `--no-randomize` preserves authored HTML.

## Typography

Body: Segoe UI/Arial/system sans; botanical, tea, recipe, reading and 503 display:
Georgia; fold, weekly and orbital display: Trebuchet MS; architectural display:
Arial Black; technical values: Consolas. Each heading has a subject-specific scale.
All stacks support Cyrillic without network requests and wrap naturally.

## Layout

Each template directory contains only `index.html`. Styles, scripts and its own
SVG favicon are embedded. The complete document fits the original curl fallback
without changing its list of resource paths. Old bundles, filenames, photographs,
source maps, generators and per-site README files are absent. Parent repository
documentation is not copied into an installed document root.

Normal document scrolling owns every page. Two-column layouts collapse at
650–750px; small controls and long references must remain inside a 320px viewport.
Status cards center within their available document width and grow naturally
when their contents exceed a viewport. Footers stay in flow. Reduced motion,
global scrollbar styling, forced colors and visible keyboard focus are defined
in every embedded stylesheet.

## Elevation & Depth

Use borders and flat tinted panels. The reading note alone uses an offset
paper-like shadow. No decorative glow or animated backgrounds.

## Shapes

Keep subject-specific marks: leaf, stairs, cup, plate, book spines, paper boat,
overlapping circles, calendar, orbit and two distinct service symbols. Inline
diagrams are decorative and clearly described; orbital distances are not to scale.

## Components

The pages are independent documents, not routes in one application. Native HTML
controls own selection/disclosure/input behavior; their operating-system popup
geometry is accepted. No shared app component or build dependency is introduced.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select | Labeled fields in page HTML | Botanical filter, tea type | Browser selected/open states |
| Form | Native inputs and page handlers | Inline script | Integer recipe input, reading note, goal | Valid/invalid, reload and blocked storage |
| Scrollbar | Document embedded stylesheet | `html` and scrollbar pseudo-elements | Document and textarea overflow | Narrow layouts and CSS inspection |

All native actions have hover, pressed, focus and disabled states. Feedback uses
reserved inline `role=status` space. Skip links move focus to the main landmark.
There are no dialogs, toasts, destructive actions, authentication or remote CRUD.

Reading notes and weekly marks are bounded localStorage data, with read/parse/
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
- Keep all site assets embedded; test the original git/API/curl transport chain.
- The one transport repair returns to the HTML directory before deleting Git's
  temporary checkout; no interactive flow or network order changes.
- Check authored and randomized installs, 320/390/768/1366px layouts, IP/clipboard/
  storage failure, no-JS content and 503 retry/reference behavior.
- Keep license and origin attribution in repository documentation.
- Public pages can be matched to a public fork; no anonymity or censorship-
  resistance guarantee is implied by changed metadata or file hashes.
