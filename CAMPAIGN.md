# CAMPAIGN.md

Kampagnenspezifischer Kontext für Claude. **Strikt pointer-basiert**: nur stabile
Meta-Infos und Zeiger auf die Wiki-Tiddler — **keine** aus Tiddlern ableitbaren Daten
(Namen, XP-Zahlen, Datumswerte, Plot-Status), damit diese Datei nicht veraltet. Den
echten Stand immer live aus den Tiddlern lesen.

## Identität

**Vandalia** — homebrewtes Fantasy-Setting (D&D 5e), Kampagne auf Deutsch. Eigene Welt,
eigene Fraktionen/Häuser/Götter; keine Vorlage aus einem offiziellen Abenteuer.

## Tisch-Meta (steht NICHT in Tiddlern)

- **Spieler ↔ Charakter:** <!-- reale Spielernamen ↔ Charaktere; vom Nutzer zu ergänzen -->
- **Hausregeln:** <!-- abweichende Regeln; vom Nutzer zu ergänzen -->
- **Kalender-Besonderheiten:** eigener In-World-Kalender (siehe `Kalender.tid`), gerendert
  über die `datumkurz`/`datumlang`/`datumrechner`-Makros.

## Aktuellen Stand aus dem Wiki lesen (Pointer statt Daten)

- **Fraktionen / Häuser / Orte / NPCs:** Tiddler mit dem jeweiligen Typ-Tag. Startpunkte:
  `Index.tid` und die Kategorie-Hub-Tiddler `Person.tid`, `Ort.tid`, `Organisation.tid`,
  `Ereignis.tid`, `Abenteuer.tid`, …
- **Aktuelles In-World-Datum:** Body von `Datum.tid`.
- **XP-Gesamtstand:** Body von `Erfahrungspunkte.tid`.
- **Offene Plot-Fäden:** Suche nach dem `OffenePunkte`-Snippet in `Ereignis`-Tiddlern.
- **Kampagnenstruktur / Handlungsbögen:** `Abenteuer`-getaggte Tiddler.
- **Spielercharaktere:** `Spieler`-getaggte Tiddler bzw. `Spieler.tid`.

## Story-Planungs-Workflow für Claude

Immer **erst den echten Tiddler-Stand verifizieren**, nie aus dem Gedächtnis oder aus
dieser Datei planen:

1. Relevante Hub-/Kategorie-Tiddler lesen (siehe Pointer oben).
2. Offene Punkte via Suche nach dem `OffenePunkte`-Snippet sammeln.
3. Betroffene NPCs / Orte / Fraktionen über ihre Tags auflösen.
4. In-World-Datum (`Datum.tid`) und XP (`Erfahrungspunkte.tid`) prüfen.
5. *Dann* konsistente Vorschläge machen, die an bestehende Tiddler/Tags anknüpfen
   (explizite `[[WikiLinks]]` setzen — es gibt kein freelinks).
