# Independent Website Collection

## Overview

The eleven folders in `sni-templates/` are separate Russian-language static
websites. The 2026-10-31 redesign replaces the previous React distributions,
their imagery, asset names, DOM, CSS and interactions. The two final entries
retain the service-unavailable concept. Template IDs and repository directory
names remain stable for existing installation commands; directory names are
not public URL prefixes.

The installer, domain prompts, CLI parser, Caddy/Nginx configuration and management
script installation follow donor commit
`a318e2c8baf3e1a4b77b27b7a56dc349b36a711b`. The template label array is the
only change inside `install_command`. The download validation fixes remain.

## Colors

Runtime CSS is canonical (model B): each site's first `:root` declaration owns
`--paper`, `--ink`, `--accent`, `--wash`. The baseline and site-specific rules
consume these semantic tokens directly. This table mirrors the authored values.

| ID | Website | CSS owner | Paper | Ink | Accent | Wash |
|---|---|---|---|---|---|---|
| 1 | Bracken Fieldbook | `10gag/fieldbook.css` | #f1f5ec | #22382b | #416b43 | #dce7d5 |
| 2 | Bayline Notes | `convertit/streets.css` | #edf1f6 | #21394b | #285d8e | #d9e4ef |
| 3 | Steep Hour | `converter/steeping.css` | #f7f0e5 | #43372d | #85512d | #e9dcc5 |
| 4 | Spoon Ratio | `downloader/pantry.css` | #fff4e8 | #493124 | #9b4328 | #f3ddc6 |
| 5 | Margin Shelf | `filecloud/shelf.css` | #efedf7 | #302a50 | #68559c | #ded8ef |
| 6 | Fold Studies | `games-site/creases.css` | #e9f3f7 | #243e55 | #23628d | #cee1eb |
| 7 | Chroma Deck | `modmanager/swatches.css` | #f0f0f4 | #282d42 | #535d9d | #dcdfea |
| 8 | Seven Small Days | `speedtest/weekmarks.css` | #eef4ee | #293f38 | #456c58 | #dce8dd |
| 9 | Orbit Almanac | `YouTube/orbits.css` | #151d35 | #e7edf9 | #a8bbef | #242f4e |
| 10 | Slate Workshop | `503-1/pause.css` | #f0f2f5 | #263747 | #456880 | #dde4ec |
| 11 | Still Service | `503-2/availability.css` | #f5eef6 | #43374f | #735280 | #e8dced |

Ordinary installation varies these tokens, metadata, cache queries and each
site's SVG symbol colors. It keeps the authored light/dark mode and symbol
geometry. No whole-document hue filter, synthetic IP endpoint or universal
generated favicon is injected. `--no-randomize` preserves the authored files.
These differences do not establish resistance to traffic/site classification.

## Typography

No font services or remote media. Body text uses Segoe UI/Arial. Botanical,
tea, recipe and reading headings use Georgia; fold, weekly and orbital headings
use Trebuchet MS. Technical values use Consolas. Each site's heading rules own
its scale and spacing. All stacks support Cyrillic; headings wrap naturally.

## Layout

Each distribution is authored directly in HTML/CSS/JavaScript. No build step,
framework, dependency or external shared runtime is required. Files have
site-specific names such as `fieldbook.js` and `availability.css`. Keep the
standard `index.html`, `site.webmanifest` and installer-only `files.list` names.
The downloader removes `files.list` before serving the site. Old bundles, photos,
source-map links, generator icons and per-site README files are absent.

Distinct structural signatures: a botanical specimen grid; an architectural
essay notebook; a cup beside a tea clock; a recipe with an ingredient ledger;
a shelf beside a private note; a paper boat beside a stepper; a contrast specimen;
a seven-day row; an orbital map; a large split 503; an arched service sidebar.
Decorative diagrams are original inline SVG/CSS. Do not present them as measured
charts or scale models. All pages own document scrolling and work at 320px.

## Elevation & Depth

Use site-specific borders and flat surfaces. Only the reading note has a small
offset shadow, referencing a loose sheet. No glow effects or animated backgrounds.

## Shapes

Botanical arch, stepped facade, rounded cup, circular plate, book spines, folded
triangle, overlapping color circles, weekday pills, orbital rings, pause marks
and an arched status panel identify the individual subjects.

## Components

These are independent single-page sites, not routes in one application. Native
HTML controls own select popups, color inputs, number input validation boundaries
and disclosure behavior. There are no authentication, upload, billing or backend
flows. Canonical behavior for the applicable capabilities is:

| Capability | Owner / contract | Verification |
|---|---|---|
| Navigation | Real anchors, visible skip link on focus, focusable main landmark | Browser keyboard checks |
| Inputs / selection | Native labeled controls, visible focus, selected/disabled semantics | Browser input and selection cases |
| Feedback | Inline reserved `role=status` regions; no toast/dialog provider needed | Success, invalid and failure cases |
| Persistence | Reading note and weekly marks only; bounded localStorage data, caught read/write/parse failures | Reload and denied-storage cases |
| Scrollbars | Each document stylesheet owns thumb, track, hover, active and forced-colors baseline | CSS baseline and browser overflow checks |
| Async | 503 IP request only, four-second abort, validated text insertion, failure label; no background reload | Network mock and failed-IP cases |

The tea timer uses elapsed wall time, pause/resume, reset and a completion message
without sound. Recipe scaling validates 1–12 integer portions and preserves the
last valid result on invalid input. Reading notes are never inserted as HTML.
The weekly tracker keys marks to the local Monday and starts a new blank week
while preserving the goal. Orbit selection and botanical filters are bounded
local datasets. The paper-fold instruction remains available as a native
disclosure even without JavaScript.

All body content is present before JavaScript executes. Status retry buttons
perform an explicit reload. No automatic refresh or invented server-recovery ETA.
The numeric 503 is presentation content; the installer retains the donor's HTTP
serving configuration. In base mode the two status pages request ipify; normal
randomization disables that request and shows the fallback address label.

## Do's and Don'ts

- Preserve installer commands, IDs, prompts and server configuration.
- Validate downloaded asset inventories and preserve the old site on failure.
- Keep content readable without JavaScript and with third-party requests blocked.
- Use textContent/input values for visitor-controlled strings.
- Verify 320/390/768/1366px layouts, reduced motion and keyboard actions.
- Keep legal attribution in repository documentation, outside served sites.
- Do not equate changed HTML or different hashes with guaranteed anonymity.
