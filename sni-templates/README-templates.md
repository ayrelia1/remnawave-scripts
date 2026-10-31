# Standalone Websites

Each numbered directory contains only `index.html`: body content, styles,
scripts and its own SVG favicon. Serve a selected directory as the document root.
No build step, framework, backend, media CDN, font service or asset copying is
required. IDs and repository folder names are stable for installer compatibility.

| ID | Directory | Website |
|---|---|---|
| 1 | `10gag` | Bracken Fieldbook — botanical guide |
| 2 | `convertit` | Bayline Notes — architecture journal |
| 3 | `converter` | Steep Hour — tea timer |
| 4 | `downloader` | Spoon Ratio — recipe scaling |
| 5 | `filecloud` | Margin Shelf — local reading note |
| 6 | `games-site` | Fold Studies — origami guide |
| 7 | `modmanager` | Chroma Deck — color contrast tool |
| 8 | `speedtest` | Seven Small Days — weekly tracker |
| 9 | `YouTube` | Orbit Almanac — planetary reference |
| 10 | `503-1` | Slate Workshop — service unavailable |
| 11 | `503-2` | Still Service — service status |

Both status pages retain a unique per-load reference, visitor IP, a five-minute
automatic reload and manual retry. IP lookup is available with `--no-randomize`;
ordinary installation disables the external request. References remain active
in both modes. They are browser-generated diagnostic labels, not server trace IDs
or security tokens. Clipboard failure supports manual selection.

Presentation is varied at installation/change time. `--no-randomize` preserves
the authored HTML. `--template N` selects a specific site; random selection can
repeat. Public files can be matched to the fork; no anonymity guarantee follows.

See [DESIGN.md](../DESIGN.md) and run `bash tests/test-selfsteal-pages.sh`.
The former [SmallPoppa collection](https://github.com/SmallPoppa/sni-templates)
has been replaced; the installer is derived from
[DigneZzZ/remnawave-scripts](https://github.com/DigneZzZ/remnawave-scripts).
Repository attribution and the [license](../LICENSE) are retained outside the
served directories.
