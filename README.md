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
npm run check  # check every tiddler: errors and hints
```

Changes made in the browser are written back automatically as `.tid` files in `tiddlers/` - no
manual saving needed. While editing, errors and hints stand below the title of a tiddler (not in
the published copy). Details/conventions: `CLAUDE.md` -> "Commands & CI", "Checks".

## Publishing

On every push to `master` a GitHub Action builds a static `index.html` and deploys it to
`gh-pages` (GitHub Pages). This published copy is **read-only**.

## License

Own content: CC0 1.0 Universal (`LICENSE`). The campaign uses content of Wizards of the Coast
and is fan content under their Fan Content Policy. The part below shows in the wiki as well
(ControlPanel -> License).

<!-- wiki -->
Was in diesem Wiki eigene Arbeit ist, steht unter
[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed.de) (`LICENSE`): frei
für alle, auch ohne Namensnennung. Inhalte anderer bleiben bei ihren Rechteinhabern; woher die
Bilder eines Eintrags stammen, steht, wo bekannt, in seiner Zeile „Quelle“.

DnDWiki-Vandalia is unofficial Fan Content permitted under the
[Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). Not approved/endorsed
by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the
Coast LLC.
<!-- /wiki -->

More documentation: `CLAUDE.md` (development/conventions), `CAMPAIGN.md` (campaign-specific).
