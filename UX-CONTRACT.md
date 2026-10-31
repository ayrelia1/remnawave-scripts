# Local Website Interaction Contracts

This contract covers the editorial cabinet and forum introduced in 2.14.0.
They are separate browser applications served as static files. There is no
account system, remote publishing, shared forum backend or administrator access
to the host. The visible privacy note describes local persistence accurately.
Visual tokens and document scroll behavior are owned by [DESIGN.md](DESIGN.md).

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native labeled select | Page HTML and application script | Status, category | Browser selection and filters |
| Form | `validateFields` and semantic forms in each application script | This contract | Material editor, new topic, reply | Invalid, valid, persistence, denied storage |
| Scrollbar | Each site's primary stylesheet | DESIGN.md | Document, bounded table overflow, textarea | 320–1366px layout checks |
| CRUD | Route controllers in `workbench.js` and `discussions.js` | This contract | Local create/edit material, create topic/reply | Full browser flows and reload |

The standalone source of each app contains its shared field, load, storage and
navigation helpers once. Its routes reuse them; there is no cross-site runtime.
Native select popup geometry is platform-owned. No row selection or bulk action
is offered. Inline `role=status` feedback owns outcome messages; no toast system.

## Routes and outcomes

- Editorial home: searchable, filterable material list, 8 items per page, total/
  draft/ready counts derived from the loaded records. Search/status survive route
  navigation in URL parameters; filtering resets pagination. Horizontal table
  overflow belongs to its panel, never the document.
- Material editor: `/workspace/editor.html?id=...`; absent ID creates a new
  material. Invalid/missing ID shows recovery instead of silently creating one.
  Save validates, writes local state, then returns to the filtered list with a
  saved message. A failed write keeps all input in the form.
- Forum home: `/`, 8 topics per page, search/category in URL parameters. Topic
  links open `/discussions/thread.html?id=...`.
- New topic: `/discussions/new.html`; successful local save opens the new topic.
  Reply saves locally and stays in the thread with explicit success feedback.
  No success is shown before localStorage accepts the write.

## Inputs and persistence

- Material title: 3–120 trimmed characters; body: 10–6000; enumerated rubric and
  draft/ready status. Ready is an organizational label, not Internet publication.
- Topic title: 5–140; author: 2–40; topic body: 10–2000; reply: 3–2000.
- Validation runs on submit, associates instructions with fields, sets
  `aria-invalid`, focuses the first invalid field, and preserves entered values.
- Typed storage records are validated before rendering. Limits: 100 local
  records, 100 messages per topic, 800000 serialized characters. Both reads and
  writes enforce compatible bounds. No secrets or credentials are collected.
- Seed JSON is read-only; local records override matching IDs. Malformed,
  blocked or unavailable storage leaves seed content readable with an explicit
  notice. User strings use textContent/input values, never HTML interpretation.
- Saves reread the current local array before replacing a record. Separate tabs
  use last-save-wins for the same record; no server synchronization is implied.

## Loading, failure and unsaved navigation

Local seed JSON has an eight-second request timeout and explicit retry after
failure. Editors stay disabled until their source is loaded. A missing forum
thread shows a readable not-found state. No automatic retry loop runs.

Typing marks a form dirty. An in-app navigation link then opens the native
`dialog` component with app-owned copy and actions. Initial focus goes to Stay;
Escape cancels, closing restores trigger focus, and proceeding explicitly
discards the unsaved form. Successful saves clear the dirty flag. This guard
covers in-app links; it is not a browser-close/reload draft-recovery mechanism.

All routes retain keyboard skip links and normal document scrolling. The two
503 sites and the other seven tools retain their prior interaction contracts,
with only their asset packaging and repository folder names changed.
