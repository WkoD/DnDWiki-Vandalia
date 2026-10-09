# TiddlyRPG

A **TiddlyWiki 5** (Node.js edition) for D&D campaigns, content in German. This repo is the
campaign **Vandalia** (details: see `CAMPAIGN.md`): per-wiki config, data tiddlers
(`PlayerLevel`) and content in `tiddlers/` plus assets (`images/`, `data/`). Engine and format
layer come as dependencies:

- **Engine:** the official [`tiddlywiki`](https://www.npmjs.com/package/tiddlywiki) from npm,
  pinned in `package.json`.
- **Format layer:** from [`TiddlyRPG-Plugins`](https://github.com/WkoD/TiddlyRPG-Plugins), pinned
  to a fixed version - the plugins `tiddlyrpg-core` and `staticfiles`.
- **D&D content:** from [`TiddlyRPG-DnD`](https://github.com/WkoD/TiddlyRPG-DnD), pinned the
  same way - the setting `tiddlyrpg-setting-forgottenrealms` (Calendar of Harptos).
- **Graph stack:** [`flibbles/tw5-graph`](https://github.com/flibbles/tw5-graph) +
  [`tw5-vis-network`](https://github.com/flibbles/tw5-vis-network) +
  [`tw5-relink`](https://github.com/flibbles/tw5-relink), each pinned to a release tag as an npm
  Git dependency.

The wiki language is German (`$:/language` = `de-DE`); internal names (tags, fields) are English.

## About this repo

This repo is a concrete **campaign** - a copy of the `TiddlyRPG` template with its own content. For
a **new** campaign use the template: [github.com/WkoD/TiddlyRPG](https://github.com/WkoD/TiddlyRPG)
(step-by-step guide "Setting up a new campaign" there).

## Editing

Edit locally with live editing:

```bash
npm install    # once: fetch engine + format layer + graph stack
npm start      # server on http://localhost:8080 with live editing
```

Changes made in the browser are written back automatically as `.tid` files in `tiddlers/` - no
manual saving needed. Details/conventions: `CLAUDE.md` -> "Commands & CI".

## Publishing

On every push to `master` a GitHub Action builds a static `index.html` and deploys it to
`gh-pages` (GitHub Pages). This published copy is **read-only**.

More documentation: `CLAUDE.md` (development/conventions), `CAMPAIGN.md` (campaign-specific).
