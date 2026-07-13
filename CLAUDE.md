# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektüberblick

TiddlyWiki 5 (Node.js-Edition) für eine D&D-Kampagne, Inhalte auf Deutsch.

## Dokumentation - Zuständigkeiten

- **CLAUDE.md** (hier): Entwicklungsunterstützung - Regeln, Konventionen,
  Bearbeitungs- und Release-Workflow.
- **README.md**: was das Projekt ist und wie eine neue Kampagne eingerichtet wird.
- **CAMPAIGN.md**: kampagnenspezifischer Kontext - in der Vorlage leeres Skelett,
  jede Kampagne pflegt ihre eigene Kopie (nicht zwischen Repos verteilt).

Neue Inhalte entsprechend einsortieren statt duplizieren. `CLAUDE.md` enthält nur
allgemeine Konventionen (keine Kampagnendaten) und wird beim Vorlagen-Update aus
`DnDWiki` **mit übernommen** (siehe "Vorlagen-Update" unten); `README.md` und
`CAMPAIGN.md` sind kampagnen-eigen und werden dabei **nicht** überschrieben. Alle
drei Dateien liegen im Repo-Root und werden vom TiddlyWiki-Build ignoriert (er
liest nur `tiddlers/`).

## Versionierung

Zwei getrennte Versionsachsen:

- **Formatschicht** -> `dndwiki-core`-Pin in `devDependencies` (z. B. `#1.1.0`),
  versioniert im separaten Repo `TiddlyDnD-Plugins`.
- **Gerüst-Vorlage** -> Feld `version` in `package.json`, steht auf der
  `DnDWiki`-Release-Version (z. B. `1.1.0`) - **keine** eigene Kampagnen-Version.

### Formatschicht-Version anheben (Pin-Bump)

Die Formatschicht wird **ausschließlich** im Repo `TiddlyDnD-Plugins` geändert,
versioniert und released - siehe dort `CLAUDE.md` -> "Neue Version
veröffentlichen". Hier (und in jeder Kampagne, die die Version will) nur der
bewusste Pin-Bump, sobald eine neue Version released ist:

```jsonc
"tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#1.1.0"
```
```bash
npm install
# npm cached Git-Tags aggressiv - falls die neue Version nicht gezogen wird:
rm -rf node_modules package-lock.json && npm install
```

**Kein Auto-Sync:** Eine neue Plugin-Version erreicht ein Wiki nur durch diesen
bewussten Pin-Bump - gewollte Stabilität/Reproduzierbarkeit.

### Vorlagen-Update (Gerüst aus `DnDWiki` übernehmen)

Optional, nur wenn gewünscht - Kampagnen müssen nicht mitziehen:

1. `git remote add template https://github.com/WkoD/DnDWiki.git` (einmalig)
2. `git fetch template --tags`
3. `git diff template/<eigene version>..template/<neue version> -- scripts .gitignore .github tiddlywiki.info package.json CLAUDE.md`
4. **Gerüst + `CLAUDE.md`** übernehmen, dann `version` in `package.json` auf die
   neue Vorlagenversion setzen.

**Übernehmbar:** **`CLAUDE.md`** (komplett - enthält nur allgemeine Konventionen,
keine Kampagnendaten), `scripts/tw.js`, `.gitignore`, `.github/workflows/`,
`tiddlywiki.info`, `package.json`-Struktur (Scripts/`devDependencies`/Plugin-Pin -
**`name`/`description` behalten**), sowie neue/geänderte generische
Standard-Wikielemente wie die Basis-Graph-Views `$:/graph/Default`|`Kosmogramm`|
`Weltkarte`|`Gegenstände` (sofern in der Kampagne nicht angepasst).

**Niemals blind überschreiben oder verwerfen - kampagnen-eigen:** aller
Lore-Content in `tiddlers/`, pro-Wiki-Konfig (SiteTitle/SiteSubtitle/
DefaultTiddlers), `Datum`/`Erfahrungspunkte` mit echten Daten, `images/`, `data/`,
die Felder `name`/`description` in `package.json`. Bei folgendem zusätzlich
prüfen, ob sich neue Template-Funktionalität **mergen** lässt, statt sie
ungeprüft zu verwerfen: `README.md` und `CAMPAIGN.md` (z. B. neue Abschnitte im
Vorlagen-Skelett) sowie in der Kampagne **angepasste** Standard-Wikielemente
(z. B. eine individualisierte `Weltkarte` mit Hintergrundbild/Positionen).

## Befehle & CI

```bash
npm install                 # Engine (tiddlywiki) + TiddlyDnD-Plugins (gepinnt) holen
npm start                   # lokalen Server mit Live-Editing starten (Standardport 8080)
npm run build               # statische index.html nach ./twpage bauen (wie CI)
```

Beide Skripte setzen `TIDDLYWIKI_PLUGIN_PATH` automatisch über den Launcher
`scripts/tw.js` (baut ihn plattformübergreifend aus allen `node_modules/*/plugins`
zusammen). Im Browser gemachte Content-Änderungen werden als `.tid`-Dateien
zurückgeschrieben; die Formatschicht erscheint nur als read-only Shadow.

**CI** (`.github/workflows/npm-build-pages.yml`): bei Push auf `master` oder
manuell - `npm install`, aktualisiert Titel/Zeitstempel-Tiddler, baut `index.html`,
kopiert `data/`+`images/` dazu, deployt nach `gh-pages`.

## Architektur & Content-Modell

### Ordnerstruktur

- `tiddlers/` - **flach**, keine Unterordner für Kategorien. Kategorisierung erfolgt ausschließlich über **Tags**, nicht über Verzeichnisstruktur.
  - Content-Tiddler: Dateiname = Titel, z. B. `Hafendorf.tid`.
  - System- und Datentiddler (`$`-Präfix, `Datum`, `Erfahrungspunkte`): siehe "System- und Datentiddler" unten.
  - Die Formatschicht (Makros, ViewTemplates, Hubs, tw5-graph-Schema) kommt aus dem Plugin `dndwiki-core` und liegt **nicht** als Datei im Wiki - dokumentiert im Repo `TiddlyDnD-Plugins`.
- `images/` - nach Kategorie sortiert, deckungsgleich mit den Content-Tags: `Person` (NPC-Portraits), `Ort`, `Ereignis`, `Organisation`, `Gegenstand`, `Karte`, `Spieler`, `Design`. Kampagnenspezifische Unterordner zur reinen Datenablage (falls vorhanden): siehe `CAMPAIGN.md`.
- `data/Buch/` - In-World-Lore-PDFs.

### System- und Datentiddler

Technische Tiddler mit fester, vom Format vorgegebener Funktion (kein Lore-Content):

| Tiddler | Funktion |
|---|---|
| `$:/SiteTitle` | Wiki-Titel (Browser-Tab/Kopf). Im Template leer - die CI trägt beim Build automatisch den Repo-Namen ein. |
| `$:/SiteSubtitle` | Untertitel. Im Template leer - die CI trägt beim Build automatisch einen Zeitstempel ein. |
| `$:/DefaultTiddlers` | Liste der Tiddler, die beim Öffnen des Wikis automatisch im Story-River angezeigt werden. |
| `$:/graph/Default` (Caption "Live") | Graph-View: aktuell offene Tiddler (`$:/StoryList`) der Haupttypen, inkl. automatischer `links`-Kanten (Wikilinks). |
| `$:/graph/Kosmogramm` | Graph-View: alle `Gott`/`Organisation`/`Person`/`Spieler`-Tiddler mit ihren Beziehungsfeldern. |
| `$:/graph/Weltkarte` | Graph-View: alle `Ort`-Tiddler plus alle Personen/Götter/Spieler mit gesetztem `ort`-Feld, verbunden über die `ort`-Kante. |
| `$:/graph/Gegenstände` | Graph-View: `Artefakt`/`Buch`/`Gegenstand`/`Material`-Tiddler plus ihre über `besitzer`/`erschaffer`/`ehemals` verknüpften Besitzer/Erschaffer/ehemaligen Besitzer sowie über `komponente` verknüpfte Zutaten. |
| `Datum` | Body = aktuelles In-World-Kalenderdatum als reiner Wert; vom DM direkt editiert. |
| `Erfahrungspunkte` | Body = aktueller XP-Gesamtstand als reine Zahl; vom DM direkt editiert. |

Gitignoret (transient, pro Sitzung/Rechner, nicht in git):

| Tiddler | Funktion |
|---|---|
| `$:/StoryList` | Aktuell im Story-River offene Tiddler; wird vom Browser bei jeder Interaktion zurückgeschrieben. |
| `$:/config/flibbles/graph/sidebar` | Merkt sich, welcher Graph-View zuletzt in der Sidebar offen war. |

Die vier Graph-Views liegen bewusst im Wiki statt im Plugin: Das Sidebar-Dropdown
listet nur reale Tiddler (Shadows erscheinen dort nicht), und z. B. die Weltkarte
kann je Kampagne eigenen Hintergrund/eigene Positionen tragen.

### Tiddler-Format

Standard-`.tid`-Format (Feld-Header, Leerzeile, Fließtext). Felder für Content-Tiddler:

- `tags` - mehrere Tags getrennt durch Leerzeichen; mehrteilige Tag-Namen stehen in `[[doppelten eckigen Klammern]]`.
- `bild` - Bilddateiname; wird anhand des Typ-Tags (Person/Ort/Ereignis/...) zu einem Bild aus `images/<Tag>/` aufgelöst.
- **Beziehungsfelder** (Listenfelder, Titel-referenzierend) - tragen das Beziehungsnetz für den Graphen: `ort`, `mitglied`, `ehemals`, `anfuehrer`, `patron`, `unter`, `familie`, `allianz`, `freundschaft`, `feindschaft` (Person/Org/Gott) sowie `besitzer`/`erschaffer`/`ehemals`/`komponente` (Gegenstände). Symmetrische Felder (`familie`/`allianz`/`freundschaft`/`feindschaft`) stehen auf **beiden** Endpunkten. `ehemals` bedeutet je nach Tiddler-Typ etwas anderes (wie auch `ort` typübergreifend verwendet wird): auf Person/Organisation/Gott ein ehemaliges Organisations-Mitglied, auf Gegenständen ein ehemaliger Besitzer (Person/Organisation). `komponente` ist gerichtet und verweist von einem herstellbaren Gegenstand (Trank/Tinktur/Artefakt) auf seine Zutaten-Gegenstände (kein Mengenfeld mehr - reine Existenz der Kante).
- `datum` - In-World-Kalenderdatum (nicht das reale Sitzungsdatum); wird für Kalenderanzeigen/-berechnungen genutzt. **Verstorben-Konvention:** Ein **Punkt irgendwo im `datum`-Wert** (z. B. `.1350-07` als Präfix, oder `1200.1351-04-14` als Geburt.Sterbedatum) markiert eine Person/Figur als verstorben.
- **Verlinkung:** Fließtext nutzt durchgehend `[[WikiLinks]]` zur expliziten Verlinkung zwischen Personen/Orten/Organisationen - das ist der primäre Vernetzungsmechanismus neben den Tags. Kein Freelinks-Plugin mehr im Einsatz -> jede Erwähnung eines existierenden Tiddler-Titels braucht einen echten Link. Präferenzreihenfolge (bevorzugt zuerst, Rest nur falls nötig):
  1. Direkter Link `[[Titel]]` bei exaktem Vorkommen.
  2. Bei Flexion/Deklination: Suffix außerhalb der Klammer ankleben (`[[Titel]]s`, `[[Titel]]er`, ...).
  3. Passt der Suffix grammatikalisch nicht (Kasus-/Präpositionswechsel): minimaler Satzumbau, der die Grundform verlinkbar macht (Beispiel: "vom [[Königreich von Vandalia]]" statt "des [[Königreiches von Vandalia|Königreich von Vandalia]]").
  4. `[[Alias|Titel]]` nur als letzte Option - echte Aliase/Decknamen oder bewusst abweichender Linktext.

  Keine blinde Massenverlinkung: jede Erwähnung inhaltlich prüfen (echte Wiki-Entität vs. externe Referenz/Zitat/generisches Wort). Erwähnungen von noch nicht existierenden Tiddlern (dangling) nicht automatisch anlegen oder verlinken - dem DM zur Entscheidung vorlegen.
- **Ereignis-Pflege:** Beim Anlegen oder inhaltlichen Bearbeiten eines `Ereignis`-Tiddlers prüfen, ob die darin (verlinkt oder unverlinkt) erwähnten Personen durch das Ereignis einen neuen, aktuelleren Aufenthaltsort erhalten - falls ja, das `ort`-Feld der betroffenen Personen-Tiddler im selben Zug mitpflegen (inkl. `modified`-Bump dort, siehe "Zeitstempel bei Tiddler-Bearbeitung").

### Zeitstempel bei Tiddler-Bearbeitung (`created`/`modified`)

`created` ist der Erstellungszeitpunkt, `modified` der Zeitpunkt der letzten
inhaltlichen Änderung. Format: UTC, `JJJJMMTTHHMMSSmmm` (17 Ziffern, z. B.
`20241112143212015` = 2024-11-12 14:32:12.015 UTC) - so legt es TiddlyWiki
selbst an, wenn im Browser bearbeitet wird.

Bei Bearbeitung **außerhalb** von TiddlyWiki (IDE, Claude, Skripte) gilt
dieselbe Pflege manuell:

- **Neuer Tiddler:** `created` auf den echten aktuellen Zeitstempel setzen;
  `modified` auf denselben Wert.
- **Bestehender Tiddler wird inhaltlich verändert** - gilt für jeden Tiddler,
  Content- wie System-/Datentiddler (Fließtext, Beziehungs-/Graph-Felder,
  sonstige Felder wie `tags`/`bild`/`datum`, eine geänderte Graph-View-Filterzeile
  usw.): `modified` auf den echten aktuellen Zeitstempel aktualisieren. `created`
  bleibt unverändert.
- **Ausnahme - keine Zeitstempel-Änderung:** technische Massenänderungen ohne
  editorielle Entscheidung über den Inhalt einzelner Tiddler, z. B. ein
  Frameworkwechsel wie die tw5-graph-Migration, die Felder/Schema mechanisch
  über viele Tiddler umgeschrieben hat.
- **Keine Ausnahme:** Batch-Aufgaben, die inhaltliche Entscheidungen **pro
  Tiddler** treffen (z. B. Backlog "Link-Ergänzung als freelinks-Ersatz" oder
  eine redundante Beziehungs-Kante entfernen), sind inhaltliche Änderungen -
  auch wenn sie viele Tiddler in einem Lauf betreffen. Dort `modified` je
  betroffenem Tiddler aktualisieren.

### Tag-Vokabular

Jeder Tiddler bekommt typischerweise zwei Arten von Tags:

1. **Typ-Tag** (template-weit gültig), grob in drei Kategorien:
   - **Daten** - beschreiben Weltzustand, i. d. R. undatiert/langlebig: `Person`, `Ort`, `Organisation`, `Gott`, `Spieler`, `Artefakt`, `Gegenstand`, `Buch`, `Material`, `Karte`.
   - **Ereignisse** - datierte/narrative Einträge: `Ereignis` (einzelner In-World-Vorfall, ggf. mehrere Zeitpunkte, siehe Tiddler-Format), `Abenteuer` (übergeordneter Handlungsstrang/Kapitel).
   - **Sonstiges** - Meta/Navigation: `Index` (Einstiegspunkt), `Information` (technische Tiddler wie `Datum`/`Erfahrungspunkte`, siehe oben).
2. Fraktions-/Handlungsstrang-Tag als thematischer Hub - die konkreten Namen sind **kampagnenspezifisch** und stehen nicht hier (siehe die `CAMPAIGN.md` bzw. die Kategorie-Hub-Tiddler des jeweiligen Wikis).

### Plugins (`tiddlywiki.info`, geliefert aus `TiddlyDnD-Plugins`)

`tiddlywiki/tiddlyweb`, `tiddlywiki/filesystem`, `tiddlywiki/highlight` (offiziell, aus der npm-Engine), `dndwiki-core` (D&D-Formatschicht), `staticfiles` (Dev-Server), `graph` + `vis-network` + `relink` (`flibbles/tw5-graph`-Stack). Inhalt/Doku der Plugins: siehe `CLAUDE.md` in `TiddlyDnD-Plugins`.
