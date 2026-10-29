# Selfsteal Website Templates

Eleven independently served presentation sites with original interaction flows
and a revised visual identity. The directory names and Selfsteal template
numbers remain compatible with existing commands.

| Number | Directory | Identity | Subject |
| --- | --- | --- | --- |
| 1 | `10gag` | Sidewalk | Memes and reaction clips |
| 2 | `convertit` | Cutlane | Video editing workspace |
| 3 | `converter` | Formatwell | File conversion |
| 4 | `downloader` | Parcelink | Download management |
| 5 | `filecloud` | Foliohaven | File storage presentation |
| 6 | `games-site` | Cartridge Club | Retro game collection |
| 7 | `modmanager` | Patchbay | Game modification library |
| 8 | `speedtest` | LineMeter | Connection checks |
| 9 | `YouTube` | Кадротека | Video collection with verification |
| 10 | `503-1` | Harbor Queue | Busy-service request card |
| 11 | `503-2` | Juniper Status | Service-status request sheet |

Serve the selected directory as the document root, including its asset folders.
These are demonstration frontends; actual storage, conversion and account
services are not supplied. Preserve the existing asset paths when copying a site.

Selfsteal applies its existing installation-time mutation by default. The
`--no-randomize` flag keeps the authored files intact, including optional IP
lookups in templates 9, 10 and 11. It does not select a particular template;
use `--template <number>` when a fixed choice is needed.

The presentation contract is documented in [DESIGN.md](../DESIGN.md). Run
`bash tests/test-selfsteal-templates.sh` from the repository root to check
metadata mutation, download-mode compatibility and local resources.

Based on the original [SmallPoppa/sni-templates](https://github.com/SmallPoppa/sni-templates)
collection distributed with [DigneZzZ/remnawave-scripts](https://github.com/DigneZzZ/remnawave-scripts).
Upstream library notices in the distributed bundles are retained. Refer to the
repository [LICENSE](../LICENSE).
