# Independent Website Distributions

Every site contains separate HTML, styles, JavaScript, SVG icon and application
manifest files. Template IDs remain 1–11; all donor directory names are replaced.
Serve the selected site's directory as the document root. No build step, remote
font service, media CDN, backend or added framework is required.

| ID | Directory | Website |
|---|---|---|
| 1 | `bracken` | Bracken Fieldbook — справочник |
| 2 | `courtyard` | Клуб Практика — форум |
| 3 | `steep-hour` | Steep Hour — чайный таймер |
| 4 | `spoon-ratio` | Spoon Ratio — рецепт |
| 5 | `editorial` | Folio Desk — редакционный кабинет |
| 6 | `fold-studies` | Fold Studies — оригами |
| 7 | `chroma-deck` | Chroma Deck — цвета |
| 8 | `seven-days` | Seven Small Days — недельный трекер |
| 9 | `orbit-almanac` | Orbit Almanac — планеты |
| 10 | `slate-status` | Slate Workshop — 503 |
| 11 | `still-status` | Still Service — 503 |

The forum includes `/discussions/thread.html`, `/discussions/new.html` and
`community/{styles,scripts,records}`. The editorial cabinet includes
`/workspace/editor.html` and `desk/{styles,scripts,records}`. These browser apps
persist local records only; no account system or public multi-user publication
is supplied. See [UX-CONTRACT.md](../UX-CONTRACT.md).

Every `files.list` is an exact download inventory. The installer requires all
listed files and removes this inventory before serving the site. Git, API and
curl all support nested resources. Parent repository documentation is not served.

Both 503 sites retain per-load references, optional IP, five-minute automatic
reload and manual retry. `--no-randomize` keeps authored metadata/colors and IP
lookup; ordinary installs vary HTML/CSS/icons/manifest and disable the IP call.
IDs remain active in both modes. Random template selection can repeat.

See [DESIGN.md](../DESIGN.md) and run `bash tests/test-selfsteal-pages.sh`.
The former SmallPoppa collection is replaced; the installer remains derived from
[DigneZzZ/remnawave-scripts](https://github.com/DigneZzZ/remnawave-scripts).
Repository [license](../LICENSE) and attribution remain outside the site roots.
Public files may still be associated with this fork; no anonymity guarantee is
implied by different text, paths or metadata.
