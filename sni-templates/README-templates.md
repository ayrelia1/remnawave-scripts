# Selfsteal Website Templates

Eleven independently authored static websites. All HTML, CSS, JavaScript, SVG
and resource names replace the previous distributions. Directory names and
Selfsteal template numbers remain compatible with existing commands.

| Number | Directory | Identity | Subject |
| --- | --- | --- | --- |
| 1 | `10gag` | Bracken Fieldbook | Botanical field guide |
| 2 | `convertit` | Bayline Notes | Architectural observations |
| 3 | `converter` | Steep Hour | Tea timer |
| 4 | `downloader` | Spoon Ratio | Recipe scaling |
| 5 | `filecloud` | Margin Shelf | Local reading note |
| 6 | `games-site` | Fold Studies | Origami instructions |
| 7 | `modmanager` | Chroma Deck | Color contrast tool |
| 8 | `speedtest` | Seven Small Days | Local weekly tracker |
| 9 | `YouTube` | Orbit Almanac | Planetary reference |
| 10 | `503-1` | Slate Workshop | Service-unavailable page |
| 11 | `503-2` | Still Service | Service-status page |

Serve a selected directory as the document root. All body content is readable
without JavaScript. Local tools use the linked scripts; no backend, framework,
build step, media CDN or font service is required. `files.list` is an installer
inventory: validate it and remove it before serving the site.

Selfsteal applies installation-time presentation variation by default. The
`--no-randomize` flag keeps the authored files intact, including optional IP
lookups in templates 10 and 11. It does not select a particular template;
use `--template <number>` when a fixed choice is needed.

The presentation contract is documented in [DESIGN.md](../DESIGN.md). Run
`bash tests/test-selfsteal-templates.sh` from the repository root to check
metadata mutation, download-mode compatibility and local resources.

The previous [SmallPoppa/sni-templates](https://github.com/SmallPoppa/sni-templates)
collection distributed with [DigneZzZ/remnawave-scripts](https://github.com/DigneZzZ/remnawave-scripts)
has been replaced. The installer remains derived from that upstream project;
refer to the repository [LICENSE](../LICENSE). Changed pages are public and do
not guarantee anonymity or resistance to site/traffic classification.
