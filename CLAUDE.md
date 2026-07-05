# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektüberblick

Dieses Repository ist ein **TiddlyWiki5** (Node.js-Edition) Wiki für eine D&D-Kampagne. Alle Inhalte sind auf Deutsch. Das Repo enthält nur die Wiki-Inhalte (Tiddlers) und Assets — die eigentliche TiddlyWiki-Engine ist **nicht** Teil dieses Repos:

- Sie stammt aus dem Sibling-Projekt `WkoD/TiddlyDnD` (ein dünner Fork von `Jermolene/TiddlyWiki5`, dessen einziger nennenswerter Unterschied zum Upstream das Entfernen einer CI-Datei ist), lokal verfügbar unter `../TiddlyDnD`.

Es gibt kein `package.json`, kein `README`, keine Tests und keinen Linter in diesem Repo — das ist reiner Wiki-Content.

## Repo-Familie & Sync

Dieses `CLAUDE.md` ist über eine kleine Repo-Familie hinweg **byte-identisch** und beschreibt nur die gemeinsame technische Schicht:

- **`DnDWiki`** — kanonisches Basis-Template (Remote `WkoD/DnDWiki`), keine Kampagnen-Lore. Hier passieren alle Änderungen an der technischen Schicht.
- **Kampagnen-Forks** (z. B. `DnDWiki-Vandalia`, `DnDWiki-Tyranny`) — je eine konkrete Kampagne. Unterscheiden sich von Base **nur** in Kampagnen-Inhalten.
- **`TiddlyDnD`** (`../TiddlyDnD`) — die Engine, per npm als Build-Abhängigkeit installiert.

Der Sync läuft **einseitig von Base in die Forks** über `.github/workflows/repo-sync.yml` (manuell auslösbar). Er übernimmt die **gesamte technische Schicht** von Base — alle System-Tiddler (`$`-Präfix), die Template-Hub-Tiddler und `tiddlywiki.info`, `.github/`, `CLAUDE.md` — und nimmt dabei **nur** die vier fork-eigenen Datendateien aus: `Datum.tid`, `Erfahrungspunkte.tid`, `Spieler.tid`, `TBC_Abenteuer.tid`. Der Sync benutzt gezielte Pfad-Checkouts (kein `git pull -X theirs` über den ganzen Baum), damit **kein** Kampagnen-Inhalt überschrieben wird.

## Doku-Ablage-Modell (wichtig!)

- **`CLAUDE.md`** (diese Datei): kanonisch in `DnDWiki`, liegt identisch in jedem Fork und **ist Teil des Sync** → Base gewinnt, alle Forks bleiben automatisch synchron. Technische Änderungen also immer in `DnDWiki` machen.
- **`CAMPAIGN.md`**: **fork-eigen** und **nicht** Teil des Sync. In `DnDWiki` liegt nur ein leeres Skelett-Template. Jeder Fork füllt seine eigene `CAMPAIGN.md` mit Tisch-Meta und Wiki-Pointern.
- **Regel:** `CAMPAIGN.md` **niemals** in die Sync-Pfadliste von `repo-sync.yml` aufnehmen — sonst würde die Base-Vorlage die ausgefüllten Fork-Versionen überschreiben.
- Beide Dateien liegen im Repo-Root und werden vom TiddlyWiki-Build ignoriert (der Build liest nur `tiddlers/`), sind also im gebauten Wiki unsichtbar.

## Befehle

Die Engine wird aus dem Sibling-Projekt heraus aufgerufen (Pfad ggf. an die tatsächliche Lage von `TiddlyDnD` anpassen):

```bash
# Lokalen Server mit Live-Editing starten (Standardport 8080)
node ../TiddlyDnD/tiddlywiki.js . --listen

# Statische index.html bauen (entspricht dem "index"-Build aus tiddlywiki.info / CI)
node ../TiddlyDnD/tiddlywiki.js . --output ./twpage --build index

# Statische Seiten-Variante bauen (static.html, alltiddlers.html, Einzelseiten je Tiddler)
node ../TiddlyDnD/tiddlywiki.js . --output ./twpage --build static
```

Der produktive Build läuft ausschließlich über GitHub Actions:

- **`.github/workflows/npm-build-pages.yml`** (push auf `master` oder manuell): installiert `TiddlyDnD` per `npm install git+https://github.com/WkoD/TiddlyDnD.git`, aktualisiert Titel/Zeitstempel-Tiddler, baut die öffentliche `index.html`, kopiert `data/` und `images/` dazu und deployed nach `gh-pages`.
- **`.github/workflows/repo-sync.yml`** (nur manuell, läuft nicht im Base-Repo selbst): übernimmt die technische Schicht aus `WkoD/DnDWiki` per gezieltem Pfad-Checkout (siehe „Repo-Familie & Sync"), ohne Kampagnen-Inhalt anzufassen, und stößt danach den Build an.

## Architektur & Content-Modell

### Ordnerstruktur

- `tiddlers/` – **flach**, keine Unterordner für Kategorien. Kategorisierung erfolgt ausschließlich über **Tags**, nicht über Verzeichnisstruktur.
  - Content-Tiddler: Dateiname = Titel, z. B. `Baile.tid`.
  - System-/Plugin-Tiddler: Präfix `$__...` (kodiert den TiddlyWiki-internen `$:/...`-Namespace).
  - Eigene Makros/Filter/Widgets im Namespace `$:/_my/...` (Dateien `$___my_*.js` mit `.meta`-Sidecar bzw. `$___my_*.tid`).
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

### Plugins (`tiddlywiki.info`)

`tiddlywiki/tiddlyweb`, `tiddlywiki/filesystem`, `tiddlywiki/highlight`, `felixhayashi/tiddlymap` (Beziehungsgraph/Karten-Ansicht, genutzt über `tmap.id`/`tmap.edges`), `felixhayashi/hotzone`, `felixhayashi/topstoryview`, `flibbles/vis-network`. Themes: `tiddlywiki/vanilla`, `tiddlywiki/snowwhite`.

### Eigene Erweiterungen (`$:/_my/...`)

Im Namespace `$:/_my/` (Dateien `$___my_*`):

- **Makros** (`$___my_Macro_*.js`): `Bild` (löst `bild`-Feld gegen `images/<Tag>/` auf), `DatumKurz`/`DatumLang`/`DatumRechner` (In-World-Kalender), `FormatLink`, `Library`, `SubLink`, `SubTiddler` (rendert `<Titel>/<Sub>`-Subtiddler), `TagLink`, `TotLink`.
- **Filter** (`$___my_Filter_*.js`): `EreignisListe`, `Map_EdgeType`, `Multitag`, `SubTiddler`.
- **ViewTemplates** (`$___my_ViewTemplate_*.tid`): `Aktivitaet`, `Bild`, `Ereignis`, `Ereignisliste`, `Gegenstand`, `Inventar`, `Link`, `Organisation`, `Ort`, `Spieler`. Reihenfolge über `list-after`; alle sind reine Render-Infrastruktur.
- **Snippets** (`$___my_Snippet_*.tid`, Tag `$:/tags/TextEditor/Snippet`): `OffenePunkte`, `SpoilerSpieler`.
- **Styles** (`$___my_Style_*.tid`): `Border`, `Gegenstand`, `Tot`. **Tag-Template** `$___my_Tag_Ort`. **Template** `$___my_Template_Bild`.
- **Buttons/App**: `$___my_Button_ExportModified*` (Export geänderter Tiddler), `$___my_App_RenameTag`.

Der überschriebene Core-Tiddler `$:/core/ui/ViewTemplate/body` (`$__core_ui_ViewTemplate_body.tid`) bindet den Spieler-Sichtbarkeitsfilter in die Standard-Body-Anzeige ein.
