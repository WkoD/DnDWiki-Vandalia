# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektüberblick

Dieses Repository ist ein **TiddlyWiki5** (Node.js-Edition) Wiki für eine D&D-Kampagne. Alle Inhalte sind auf Deutsch. Das Repo enthält nur die Wiki-Inhalte (Tiddlers), Assets und die Build-Konfiguration:

- **Engine:** offizielles `tiddlywiki` aus npm (kein eigener Fork mehr), als devDependency in `package.json` gepinnt (`5.4.0`).
- **Formatschicht & alle Plugins:** kommen aus dem separaten Repo **`WkoD/TiddlyDnD-Plugins`** (lokal `../TiddlyDnD-Plugins`), das per **fester Version** in `package.json` gepinnt ist (`git+…/TiddlyDnD-Plugins.git#<version>`). Die D&D-Formatschicht ist dort das Plugin `$:/plugins/wkod/dndwiki-core`. Eingebunden über `TIDDLYWIKI_PLUGIN_PATH` (→ `node_modules/tiddlydnd-plugins/plugins`).

`DnDWiki` selbst ist die **kopierbare Kampagnen-Vorlage**: nur pro-Wiki-Konfig + Datendatei-Vorlagen + (leerer) Content, **keine** Formatschicht (die liegt im Plugin).

## Repo-Familie & Versionierung (kein Sync mehr)

- **`DnDWiki`** — kopierbare Kampagnen-Vorlage (Remote `WkoD/DnDWiki`), keine Kampagnen-Lore. Eine neue Kampagne entsteht durch **1:1-Kopie** dieses Repos.
- **Kampagnen** (z. B. `DnDWiki-Vandalia`, `DnDWiki-Tyranny`) — je eine konkrete Kampagne = Kopie der Vorlage + eigener Content + eigene `Datum`/`Erfahrungspunkte`/pro-Wiki-Konfig.
- **`TiddlyDnD-Plugins`** — Formatschicht (`dndwiki-core`) + `staticfiles` + felixhayashi/flibbles-Drittanbieter, **versioniert** (semver-Tags + GitHub-Releases). Die Formatschicht wird **ausschließlich dort** bearbeitet.

**Kein `repo-sync.yml` mehr.** Statt Datei-Sync gilt: jedes Wiki **pinnt eine feste Plugin-Version** und aktualisiert sie **bewusst** (Pin `#1.0.0` → `#1.1.0` + `npm install`). Das Plugin-Repo kennt die Kampagnen nicht (skaliert beliebig, stabil/reproduzierbar).

## Doku-Ablage-Modell

- **`CLAUDE.md`** / **`README.md`**: liegen in jedem Repo; da es keinen Sync mehr gibt, werden sie bei Bedarf aus der `DnDWiki`-Vorlage übernommen (Pull, nicht Push).
- **`CAMPAIGN.md`**: **kampagnen-eigen**. In `DnDWiki` liegt nur ein leeres Skelett-Template; jede Kampagne füllt ihre eigene.
- Alle drei liegen im Repo-Root und werden vom TiddlyWiki-Build ignoriert (der Build liest nur `tiddlers/`).

## Befehle

```bash
npm install                 # Engine (tiddlywiki@5.4.0) + TiddlyDnD-Plugins (gepinnt) holen
npm start                   # lokalen Server mit Live-Editing starten (Standardport 8080)
npm run build               # statische index.html nach ./twpage bauen (wie CI)
```

Beide Skripte setzen `TIDDLYWIKI_PLUGIN_PATH` automatisch. **Formatschicht ändern** → im Repo `TiddlyDnD-Plugins` (nicht hier); dort neue Version taggen/releasen, dann hier den Pin in `package.json` anheben.

Der produktive Build läuft über GitHub Actions:

- **`.github/workflows/npm-build-pages.yml`** (push auf `master` oder manuell): `npm install` (holt Engine + gepinnte Plugins), aktualisiert Titel/Zeitstempel-Tiddler, baut die öffentliche `index.html` (mit gesetztem `TIDDLYWIKI_PLUGIN_PATH`), kopiert `data/` und `images/` dazu und deployed nach `gh-pages`.

## Architektur & Content-Modell

### Ordnerstruktur

- `tiddlers/` – **flach**, keine Unterordner für Kategorien. Kategorisierung erfolgt ausschließlich über **Tags**, nicht über Verzeichnisstruktur.
  - Content-Tiddler: Dateiname = Titel, z. B. `Baile.tid`.
  - Im Wiki liegen nur wenige `$__...`-Tiddler (pro-Wiki-Konfig: SiteTitle/SiteSubtitle/DefaultTiddlers/StoryList, tiddlymap saved views) + die Datendateien `Datum`/`Erfahrungspunkte`.
  - Die Formatschicht (`$:/_my/...`, Hubs, tiddlymap-Schema) kommt aus dem Plugin `wkod/dndwiki-core` und ist **nicht** als Datei im Wiki.
- `images/` – nach Kategorie sortiert, deckungsgleich mit den Content-Tags: `Person` (NPC-Portraits), `Ort`, `Ereignis`, `Organisation`, `Gegenstand`, `Karte`, `Spieler`, `Design`.
  - `images/Karte/maptool/` enthält Kampfkarten für ein externes VTT (RPTools MapTool) und wird **nicht** aus Tiddlern referenziert — rein externes Asset für den Spieltisch.
- `data/Buch/` – In-World-Lore-PDFs.

### Tiddler-Format

Standard-`.tid`-Format (Feld-Header, Leerzeile, Fließtext). Relevante Felder:

- `tags` – mehrere Tags getrennt durch Leerzeichen; mehrteilige Tag-Namen stehen in `[[doppelten eckigen Klammern]]`.
- `bild` – Bilddateiname; wird vom eigenen Makro `$___my_Macro_Bild.js` gelesen und anhand des Typ-Tags (Person/Ort/Ereignis/…) zu `[img[images/<Tag>/<Datei>]]` aufgelöst.
- `tmap.id` / `tmap.edges` – vom Plugin `felixhayashi/tiddlymap` genutzt, um Tiddler als Knoten/Kanten im interaktiven Beziehungsgraphen darzustellen.
- `datum` – In-World-Kalenderdatum (nicht das reale Sitzungsdatum), gerendert/berechnet über die eigenen Makros `datumkurz` / `datumlang` / `datumrechner`.
- Fließtext nutzt durchgehend `[[WikiLinks]]` zur Verlinkung zwischen Personen/Orten/Organisationen – das ist der primäre Vernetzungsmechanismus neben den Tags. (Es gibt **kein** freelinks-Plugin; Verlinkung ist immer explizit.)

### Tag-Vokabular

Jeder Tiddler bekommt typischerweise zwei Arten von Tags:

1. Typ-Tag (template-weit gültig): `Person`, `Ereignis`, `Ort`, `Organisation`, `Artefakt`, `Gegenstand`, `Buch`, `Gott`, `Material`, `Abenteuer`, `Karte`, `Spieler`, `Index`, `Information`.
2. Fraktions-/Handlungsstrang-Tag als thematischer Hub — die konkreten Namen sind **kampagnenspezifisch** und stehen nicht hier (siehe die `CAMPAIGN.md` bzw. die Kategorie-Hub-Tiddler des jeweiligen Forks).

### Kampagnen-Konventionen (nicht offensichtlich, aber wichtig)

- **Keine separaten Session-Logs**: Sitzungen werden nicht als eigene datierte Tiddler geführt, sondern als Ergänzungen an bestehenden `Ereignis`-getaggten Tiddlern. Ein Ereignis-Tiddler kann mehrere In-World-Zeitpunkte sammeln, getrennt durch `---` und mit `<<datumlang ...>>`-Überschriften.
- **Erfahrungspunkte**: `Erfahrungspunkte.tid` enthält als Body nur eine rohe Gesamt-XP-Zahl — kein Per-Session- oder Per-Charakter-Tracking.
- **In-World-Datum**: `Datum.tid` enthält als Body das aktuelle Kampagnendatum.
- **Offene Punkte**: Kein zentraler Tracker. Das Snippet `$:/_my/Snippet/OffenePunkte` (Datei `$___my_Snippet_OffenePunkte.tid`) wird inline in `Ereignis`-Tiddler eingefügt und rendert eine rot umrandete Callout-Box, um offene Handlungsstränge zu markieren; wird entfernt/verkleinert, sobald der Strang aufgelöst ist.
- **Orte** haben oft einen begleitenden Karten-Tiddler `<Name>_Karte.tid` (Tag `Karte`, `bild`-Feld) neben dem Haupt-Tiddler `<Name>.tid`.
- **Spieler-Sichtbarkeit**: Über den Zustand `$:/state/Spieler` und die `ViewTemplate_Spieler`/`SpoilerSpieler`-Mechanik lässt sich die Ansicht zur Laufzeit auf eine Spieler-Perspektive umschalten. Das ist reine Render-Bequemlichkeit, **kein** Zugriffsschutz — das Repo ist öffentlich.

### Plugins (`tiddlywiki.info`, geliefert aus `TiddlyDnD-Plugins`)

`tiddlywiki/tiddlyweb`, `tiddlywiki/filesystem`, `tiddlywiki/highlight` (offiziell, aus der npm-Engine), `wkod/dndwiki-core` (die **D&D-Formatschicht**, s. u.), `wkod/staticfiles` (Dev-Server, s. u.), `felixhayashi/tiddlymap` (Beziehungsgraph/Karten-Ansicht, genutzt über `tmap.id`/`tmap.edges`), `felixhayashi/hotzone`, `felixhayashi/topstoryview`, `flibbles/vis-network`. Themes: `tiddlywiki/vanilla`, `tiddlywiki/snowwhite`. Die Nicht-Offiziellen liegen alle im Repo `TiddlyDnD-Plugins` und werden per `TIDDLYWIKI_PLUGIN_PATH` gefunden.

### Dev-Server-Plugin (`$:/plugins/wkod/staticfiles`)

Server-Plugin (jetzt in `TiddlyDnD-Plugins`, Feld `platform: server`) mit einem `module-type: route`-Modul, das im `--listen`-Node-Server die Ordner `images/` und `data/` unter `/images/…` bzw. `/data/…` ausliefert (mit `..`-Traversal-Schutz). Nötig, damit die relativen `[img[images/…]]`-Pfade aus dem `bild`-Makro **im lokalen Server** Bilder zeigen — der Standard-Server bedient sonst nur `/files/`. Durch `platform: server` schließt TiddlyWikis Offline-Save-Filter das Plugin **aus dem Build (`index.html`) aus**: die gebaute/deployte Seite bleibt unverändert (dort liegt `images/` ohnehin neben `index.html`). Reines Dev-Hilfsmittel.

### Eigene Erweiterungen (`$:/_my/...`) — im Plugin `wkod/dndwiki-core`

Die Formatschicht liegt **nicht** mehr lose im Wiki, sondern im Plugin
`TiddlyDnD-Plugins → plugins/wkod/dndwiki-core/` (Ordner-Plugin, kein Build). Sie erscheint hier als read-only Shadow-Tiddler; **bearbeitet wird sie ausschließlich im Plugin-Repo**. Inhalt:

- **Makros** (`$:/_my/Macro/*`): `Bild` (löst `bild`-Feld gegen `images/<Tag>/` auf), `DatumKurz`/`DatumLang`/`DatumRechner` (In-World-Kalender), `FormatLink`, `Library`, `SubLink`, `SubTiddler` (rendert `<Titel>/<Sub>`-Subtiddler), `TagLink`, `TotLink`.
- **Filter** (`$:/_my/Filter/*`): `EreignisListe`, `Map_EdgeType`, `Multitag`, `SubTiddler`.
- **ViewTemplates** (`$:/_my/ViewTemplate/*`): `Aktivitaet`, `Bild`, `Ereignis`, `Ereignisliste`, `Gegenstand`, `Inventar`, `Link`, `Organisation`, `Ort`, `Spieler`. Reihenfolge über `list-after`; reine Render-Infrastruktur.
- **Snippets** (Tag `$:/tags/TextEditor/Snippet`): `OffenePunkte`, `SpoilerSpieler`.
- **Styles**: `Border`, `Gegenstand`, `Tot`. **Tag-Template** `Tag_Ort`. **Template** `Template_Bild`. **App**: `RenameTag`.
- **Index-/Hub-Tiddler** (Person, Ort, Organisation, Ereignis, …, Spieler, TBC/Abenteuer) und das **tiddlymap-Schema** (edge/nodeTypes) liegen ebenfalls im Plugin.

Der überschriebene Core-Tiddler `$:/core/ui/ViewTemplate/body` bindet den Spieler-Sichtbarkeitsfilter in die Standard-Body-Anzeige ein (ebenfalls im Plugin).

> Hinweis: Das `_my`-Präfix ist historisch und soll später auf ordentliche Namen umgestellt werden (Backlog). Ein früherer „Export Modified"-Button wurde entfernt.
