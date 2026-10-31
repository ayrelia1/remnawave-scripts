# Local Website Interaction Contracts

This contract covers the forum and the rejection-only access screen in 2.14.1.
They are separate browser applications served as static files. There is no
account system, remote publishing, shared forum backend or administrator access
to the host. The forum's visible privacy note describes local persistence accurately.
Visual tokens and document scroll behavior are owned by [DESIGN.md](DESIGN.md).

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native labeled select | Page HTML and application script | Category | Browser selection and filters |
| Form | Forum `validateFields` and sign-in submit controller | This contract | Sign-in, new topic, reply | Invalid, valid, persistence, denied storage |
| Scrollbar | Each site's primary stylesheet | DESIGN.md | Document, textarea | 320–1366px layout checks |
| CRUD | Forum route controller in `discussions.js` | This contract | Local create topic/reply | Full browser flows and reload |

The forum controller contains shared field, load, storage and navigation helpers
once. Its routes reuse them; there is no cross-site runtime.
Native select popup geometry is platform-owned. No row selection or bulk action
is offered. Inline `role=status` feedback owns forum outcomes; sign-in errors use
`role=alert`. There is no toast system.

## Routes and outcomes

- Forum home: `/`, 8 topics per page, search/category in URL parameters. Topic
  links open `/discussions/thread.html?id=...`.
- New topic: `/discussions/new.html`; successful local save opens the new topic.
  Reply saves locally and stays in the thread with explicit success feedback.
  No success is shown before localStorage accepts the write.

## Inputs and persistence

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
failure. The forum composer stays disabled until its source is loaded. A missing forum
thread shows a readable not-found state. No automatic retry loop runs.

Typing in a forum composer marks it dirty. An in-app navigation link then opens the native
`dialog` component with app-owned copy and actions. Initial focus goes to Stay;
Escape cancels, closing restores trigger focus, and proceeding explicitly
discards the unsaved form. Successful saves clear the dirty flag. This guard
covers in-app links; it is not a browser-close/reload draft-recovery mechanism.

All routes retain keyboard skip links and normal document scrolling. The two
503 sites and the seven tools retain their prior interaction contracts,
with only their asset packaging and repository folder names changed.

## Template 5: access screen

`editorial/index.html` is the only page in this template. Login and password
must be non-empty; every filled submission then shows the same invalid-credentials
message. There is no accepted identity or navigation into a cabinet. The password
is cleared/remasked after rejection, the username stays only in the current input,
and focus moves to the password. The show/hide control has real pressed semantics.

The script never sends, persists or logs input, and never creates a cookie. The
form's fieldset starts disabled; JavaScript registers handlers before enabling it.
Inputs intentionally have no name attributes and autocomplete is off. Without
JavaScript the page remains readable and the form cannot submit. Browser tests
assert repeated rejection, Enter submission, masking, empty-field validation,
unchanged URL, zero submission requests, zero cookies and empty web storage.
