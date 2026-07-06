# DnDWiki

Ein **TiddlyWiki 5** (Node.js-Edition) für D&D-Kampagnen. Dieses Repo ist die
**kopierbare Kampagnen-Vorlage**: es enthält nur pro-Wiki-Konfig, die Datendatei-Vorlagen
(`Datum`, `Erfahrungspunkte`) und (leeren) Content in `tiddlers/` sowie Assets
(`images/`, `data/`). Engine und Formatschicht kommen als Abhängigkeiten:

- **Engine:** offizielles [`tiddlywiki`](https://www.npmjs.com/package/tiddlywiki) aus npm
  (kein eigener Fork mehr), in `package.json` gepinnt.
- **Formatschicht + alle Plugins:** aus [`TiddlyDnD-Plugins`](https://github.com/WkoD/TiddlyDnD-Plugins),
  **fest versioniert** gepinnt. Die D&D-Formatschicht ist dort das Plugin `wkod/dndwiki-core`.

> Ergänzende Dateien: `CLAUDE.md` (technische Detail-Doku), `CAMPAIGN.md` (kampagnenspezifisch).

## Repo-Familie

| Repo | Rolle |
|------|-------|
| **`DnDWiki`** | Kopierbare **Kampagnen-Vorlage** (ohne Kampagnen-Lore). |
| **`DnDWiki-Vandalia`**, **`DnDWiki-Tyranny`** | Kampagnen = Kopie der Vorlage + eigener Content + eigene `Datum`/`Erfahrungspunkte`/Konfig. |
| **`TiddlyDnD-Plugins`** | Formatschicht (`dndwiki-core`) + `staticfiles` + Drittanbieter, **versioniert** (semver-Tags/Releases). |

**Neue Kampagne** = dieses Repo **1:1 kopieren**, Content füllen. Es müssen keine
Ordner ausgeschlossen werden — Formatschicht/Plugins kommen aus dem Pin.

## Lokale Entwicklung

**Voraussetzung:** [Node.js](https://nodejs.org/).

```bash
npm install     # Engine (tiddlywiki@5.4.0) + TiddlyDnD-Plugins (gepinnt) holen
npm start       # Server mit Live-Editing auf http://localhost:8080
npm run build   # statische index.html nach ./twpage bauen (wie CI)
```

Im Browser gemachte Änderungen an **Content** werden als `.tid`-Dateien zurückgeschrieben.
Die **Formatschicht** (Makros/ViewTemplates/Hubs) erscheint als read-only Shadow — sie wird
**nicht hier**, sondern im Repo `TiddlyDnD-Plugins` bearbeitet (s. u.).

Beide Skripte setzen `TIDDLYWIKI_PLUGIN_PATH=node_modules/tiddlydnd-plugins/plugins` automatisch.

**Bilder im Dev-Server:** Das Plugin `wkod/staticfiles` (aus `TiddlyDnD-Plugins`, `platform: server`)
liefert `images/` und `data/` im `--listen`-Server aus. Es ist aus dem Offline-Build ausgeschlossen.

### In VS Code arbeiten

Die Multi-Root-Workspace-Datei `DnDWiki.code-workspace` (im übergeordneten Ordner) bündelt alle
Repos und bietet pro Wiki einen Start-Button/Task (Ports: DnDWiki 8080 / Vandalia 8081 / Tyranny 8082).

## Formatschicht ändern & Plugin-Version anheben (Versions-Bump)

Die gemeinsame Formatschicht liegt **im Repo `TiddlyDnD-Plugins`**. Ablauf einer Änderung:

1. Im Repo `TiddlyDnD-Plugins`: Format-Dateien unter `plugins/wkod/dndwiki-core/` im IDE bearbeiten,
   `npm start` zur Vorschau. Dann die `version` in `plugins/wkod/dndwiki-core/plugin.info` erhöhen
   (semver: patch=Fix, minor=neu+abwärtskompatibel, major=brechend).
2. Committen, **taggen == Version** und Release setzen:
   ```bash
   git tag 1.1.0 && git push origin master 1.1.0
   gh release create 1.1.0 --generate-notes
   ```
3. In **diesem** Wiki (und jeder Kampagne, die die neue Version will) den Pin in `package.json`
   **bewusst** anheben und neu installieren:
   ```jsonc
   "tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#1.1.0"
   ```
   ```bash
   npm install
   ```

**Kein Auto-Sync:** Eine neue Plugin-Version erreicht ein Wiki erst durch diesen bewussten
Pin-Bump — gewollte Stabilität und Reproduzierbarkeit (jeder Klon baut denselben Stand). Das
Plugin-Repo kennt die Kampagnen nicht.

## Deployment & CI (GitHub Actions)

- **`npm-build-pages.yml`** — bei Push auf `master` oder manuell: `npm install` (holt Engine +
  gepinnte Plugins), aktualisiert Titel/Zeitstempel-Tiddler, baut die öffentliche `index.html`
  (mit gesetztem `TIDDLYWIKI_PLUGIN_PATH`), kopiert `data/` und `images/` dazu und deployt nach
  `gh-pages`.

Es gibt **keinen `repo-sync`-Workflow und kein `DISPATCH_PAT`-Secret mehr** — die gemeinsame
Schicht kommt über den Plugin-Pin, nicht über Datei-Sync.
