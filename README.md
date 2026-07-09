# DnDWiki

Ein **TiddlyWiki 5** (Node.js-Edition) für D&D-Kampagnen, Inhalte auf Deutsch.
Dieses Repo ist die Kampagne **Vandalia** (Details: siehe `CAMPAIGN.md`):
pro-Wiki-Konfig, Datendateien (`Datum`, `Erfahrungspunkte`) und Content in
`tiddlers/` sowie Assets (`images/`, `data/`). Engine und Formatschicht kommen als
Abhängigkeiten:

- **Engine:** offizielles [`tiddlywiki`](https://www.npmjs.com/package/tiddlywiki)
  aus npm, in `package.json` gepinnt.
- **Formatschicht:** aus [`TiddlyDnD-Plugins`](https://github.com/WkoD/TiddlyDnD-Plugins),
  fest versioniert gepinnt - dort das Plugin `dndwiki-core` (+ `staticfiles`).
- **Graph-Stack:** [`flibbles/tw5-graph`](https://github.com/flibbles/tw5-graph) +
  [`tw5-vis-network`](https://github.com/flibbles/tw5-vis-network) +
  [`tw5-relink`](https://github.com/flibbles/tw5-relink), einzeln als
  npm-Git-Dependency auf Release-Tags gepinnt.

## Über dieses Repo

Dieses Repo ist eine konkrete **Kampagne** - eine Kopie der `DnDWiki`-Vorlage mit
eigenem Content. Für eine **neue** Kampagne die Vorlage nutzen:
[github.com/WkoD/DnDWiki](https://github.com/WkoD/DnDWiki) (dort die
Schritt-für-Schritt-Anleitung "Neue Kampagne einrichten").

Weitere Doku: `CLAUDE.md` (Entwicklung/Konventionen), `CAMPAIGN.md`
(kampagnenspezifisch).
