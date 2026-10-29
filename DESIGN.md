# Selfsteal Template Presentation

## Overview

This design context applies only to the eleven independently served sites in
`sni-templates/`. They are presentation templates, not a connected application.
Each keeps its original interaction engine, template number and asset paths.
The collection uses distinct identities rather than a shared public-facing brand.

The intended result is a set of ordinary content, utility and service-status
pages with their own writing, restrained typography and recognizable layouts.
Avoid upstream product names, stock promotional headlines, default generator
icons and a uniform visual treatment across all templates.

## Colors

The `:root` block appended to each template's existing stylesheet is the runtime
source of truth. `--site-ink`, `--site-panel`, `--site-paper`, `--site-accent`,
`--site-bright`, `--site-wash` and `--site-second` own the local presentation.
Existing utility declarations use the corresponding palette. Keep selectors
unchanged when recoloring utility values; selectors containing escaped colors
must still match their original JavaScript class names.

| Directory | Identity | Ink | Accent | Paper | Layout character |
| --- | --- | --- | --- | --- | --- |
| `10gag` | Sidewalk | `#172d43` | `#24678c` | `#edf4f8` | Blue masthead rule, compact feed, rounded picture cards |
| `convertit` | Cutlane | `#102832` | `#68d0c2` | `#edf7f5` | Petrol workspace, large short headline, framed link entry |
| `converter` | Formatwell | `#282747` | `#574d9b` | `#f1f2f9` | Lavender file desk, two-column feature rows |
| `downloader` | Parcelink | `#142d35` | `#75c5ae` | `#eef5f2` | Deep green transfer panel, quieter status tiles |
| `filecloud` | Foliohaven | `#163e3c` | `#247368` | `#f0f7f3` | Left-aligned folder story, pale green opening |
| `games-site` | Cartridge Club | `#18213d` | `#8ca9f4` | `#eef1f9` | Blue cartridge shelf, amber controls, monospace labels |
| `modmanager` | Patchbay | `#222b3e` | `#a5b8e8` | `#eff3f9` | Slate library, muted periwinkle, compact feature panels |
| `speedtest` | LineMeter | `#193a42` | `#216e78` | `#edf5f5` | Dark instrument masthead, pale measurement panel |
| `YouTube` | Кадротека | `#18263a` | `#91bce8` | `#edf2f8` | Blue viewing room, three-column desktop collection |
| `503-1` | Harbor Queue | `#213950` | `#276581` | `#edf3f8` | Light request card with a strong left rule |
| `503-2` | Juniper Status | `#203f3c` | `#286e5e` | `#eff6f2` | Green status sheet, paired request and timer panels |

Installation-time hue rotation remains an additional layer over these base
palettes. `--no-randomize` serves the authored palettes unchanged.

## Typography

Use local system fonts; the templates must not require a font CDN. Sidewalk,
Cutlane, Кадротека and Juniper Status use Trebuchet MS with sans-serif fallbacks.
Cartridge Club uses Lucida Console/Consolas. The remaining sites use Segoe UI
with system fallbacks. Heading weight, tracking and scale distinguish the sites;
controls inherit the page font. Keep readable line lengths and allow headings
to wrap on narrow screens.

## Layout

Each folder is a complete standalone website. Extend its existing stylesheet
instead of introducing a shared runtime asset that the downloader would omit.
Preserve application mounting, routes, event handlers, timer behavior, form
validation, filters and language selection. Change their presentation and copy
without adding backend capabilities or new external requests.

Pages scroll naturally. Keep request identifiers wrapping inside status cards,
forms within the viewport, and all existing actions reachable at 390px width.

## Elevation & Depth

Use borders and modest shadows to separate tools from their backgrounds.
Status pages use light surfaces; game and media collections retain dark rooms.
Do not place bright glows behind routine form controls.

## Shapes

Use the site-specific vector monogram and matching raster icons. Game controls
remain squarer than storage and media panels. Keep room around monograms so
maskable application icons remain legible.

## Components

The existing distribution bundles own interaction behavior. Text literals may
change; class names, format keys, category keys, URLs and validation rules remain
compatible. Each page stylesheet owns visible focus, scrollbar presentation,
inherited control typography and reduced-motion overrides.

HTML title, description, Open Graph fields and application manifest describe
the new identity. The Selfsteal randomizer updates those metadata fields
together. The visible page identity remains the authored template identity,
as with the original templates. No new data collection is introduced.

## Do's and Don'ts

- Check both the authored page and a randomized installation in a browser.
- Preserve external IP lookups in the base video and status templates; normal
  randomized installation keeps the existing same-origin replacement behavior.
- Keep the template number-to-directory mapping stable.
- Verify the original interaction paths after editing distributed bundles.
- Do not confuse different file hashes with a guarantee against classification.
- Keep author and license attribution in repository documentation.
