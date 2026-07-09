# CAMPAIGN.md

Kampagnenspezifischer Kontext für Claude. **Strikt pointer-basiert**: nur stabile
Meta-Infos und Zeiger auf die Wiki-Tiddler - **keine** aus Tiddlern ableitbaren Daten
(Namen, XP-Zahlen, Datumswerte, Plot-Status), damit diese Datei nicht veraltet. Den
echten Stand immer live aus den Tiddlern lesen.

## Identität

**Vandalia** - homebrewtes Fantasy-Setting (D&D 5e), Kampagne auf Deutsch. Eigene Welt,
eigene Fraktionen/Häuser/Götter; keine Vorlage aus einem offiziellen Abenteuer.

## Tisch-Meta (steht NICHT in Tiddlern)

- **Spieler <-> Charakter:** <!-- reale Spielernamen <-> Charaktere; vom Nutzer zu ergänzen -->
- **Hausregeln:** <!-- abweichende Regeln; vom Nutzer zu ergänzen -->

## Konventionen (DM-Entscheidung)

- **Session-Doku:** keine separaten Session-Log-Tiddler. Sitzungen werden als
  Ergänzung an das jeweilige `Ereignis`-Tiddler angehängt - ein Ereignis-Tiddler
  kann mehrere In-World-Zeitpunkte sammeln, getrennt durch `---` und mit
  `<<datumlang ...>>`-Überschriften.
- **Offene Punkte/Plot-Fäden:** das `OffenePunkte`-Snippet wird inline in
  `Ereignis`-Tiddlern eingefügt (rot umrandete Callout-Box); wird
  entfernt/verkleinert, sobald der Strang aufgelöst ist. Kein zentraler Tracker.
- **Karten zu Orten:** Orte haben oft einen begleitenden Karten-Tiddler
  `<Name>_Karte.tid` (Tag `Karte`, `bild`-Feld) neben dem Haupt-Tiddler `<Name>.tid`.
- **Spieler-Sichtbarkeit:** `$:/state/Spieler`-Umschaltung wird genutzt, um am
  Tisch zwischen DM- und Spieler-Perspektive zu wechseln (reine
  Render-Bequemlichkeit, kein Zugriffsschutz - das Repo ist öffentlich).
- **Kampagnenspezifische Ordner/Assets:** `images/Karte/maptool/` enthält
  Kampfkarten für ein externes VTT (RPTools MapTool); wird **nicht** aus
  Tiddlern referenziert - rein externes Asset für den Spieltisch.

## Story-Planungs-Workflow für Claude

**Erst den echten Tiddler-Stand über diese Pointer lesen, nie aus dem Gedächtnis
oder aus dieser Datei planen:**

- **Fraktionen / Häuser / Orte / NPCs:** Tiddler mit dem jeweiligen Typ-Tag. Startpunkte:
  `Index.tid` und die Kategorie-Hub-Tiddler `Person.tid`, `Ort.tid`, `Organisation.tid`,
  `Ereignis.tid`, `Abenteuer.tid`, ...
- **Aktuelles In-World-Datum:** Body von `Datum.tid`.
- **XP-Gesamtstand:** Body von `Erfahrungspunkte.tid`.
- **Offene Plot-Fäden:** Suche nach dem `OffenePunkte`-Snippet in `Ereignis`-Tiddlern.
- **Kampagnenstruktur / Handlungsbögen:** `Abenteuer`-getaggte Tiddler.
- **Spielercharaktere:** `Spieler`-getaggte Tiddler bzw. `Spieler.tid`.

*Dann* konsistente Vorschläge machen, die an bestehende Tiddler/Tags anknüpfen
(explizite `[[WikiLinks]]` setzen).
