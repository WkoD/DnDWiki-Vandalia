# DnDWiki

Ein **TiddlyWiki 5** (Node.js-Edition) für eine D&D-Kampagne. Das Repo enthält nur die
Wiki-Inhalte (Tiddler in `tiddlers/`) und Assets (`images/`, `data/`) — die TiddlyWiki-Engine
selbst liegt im Schwester-Projekt [`TiddlyDnD`](https://github.com/WkoD/TiddlyDnD).

> Diese README ist die **menschenlesbare** Doku (Setup, Betrieb, CI/Secrets). Ergänzende Dateien:
> - `CLAUDE.md` — technische Detail-Doku für die KI-Assistenz (Content-Modell, eigene Makros/Plugins).
> - `CAMPAIGN.md` — kampagnenspezifischer Kontext (nur in den Forks ausgefüllt).

## Repo-Familie

| Repo | Rolle |
|------|-------|
| **`DnDWiki`** | Kanonisches **Basis-Template** (ohne Kampagnen-Lore). Hier passieren alle Änderungen an der gemeinsamen technischen Schicht. |
| **`DnDWiki-Vandalia`**, **`DnDWiki-Tyranny`** | Kampagnen-**Forks**. Enthalten echten Kampagnen-Inhalt; technisch identisch zu Base. |
| **`TiddlyDnD`** | Die **Engine** (dünner Fork von `TiddlyWiki5`), wird lokal daneben ausgecheckt bzw. im CI per npm installiert. |

Die technische Schicht wird **einseitig von Base in die Forks** synchronisiert (siehe *Sync* unten).

## Lokale Entwicklung

**Voraussetzungen:** [Node.js](https://nodejs.org/) und die Engine `TiddlyDnD` als Schwester-Ordner
(`../TiddlyDnD` neben diesem Repo).

**Wiki mit Live-Editing starten** (aus dem Repo-Ordner heraus, Standardport 8080):

```bash
node ../TiddlyDnD/tiddlywiki.js . --listen
```

Dann im Browser `http://localhost:8080` öffnen. Im Browser gemachte Änderungen werden automatisch
als `.tid`-Dateien zurück auf die Platte geschrieben.

### In VS Code arbeiten (ohne separaten Browser)

Es gibt eine Multi-Root-Workspace-Datei `DnDWiki.code-workspace` (im übergeordneten Ordner, **nicht**
Teil der Repos), die alle Repos bündelt und pro Wiki einen Server-Task bereitstellt:

| Task | Wiki | Port |
|------|------|------|
| `TW: DnDWiki (8080)` | Base | 8080 |
| `TW: Vandalia (8081)` | Vandalia | 8081 |
| `TW: Tyranny (8082)` | Tyranny | 8082 |

Ablauf: **Tasks: Run Task** → gewünschten Server starten → **Simple Browser: Show** →
`http://localhost:<port>`. Das Wiki läuft dann als Tab *innerhalb* von VS Code (volle Funktion inkl.
Bilder). Empfohlene Extension fürs `.tid`-Editing: **`joshua-fontany.tw5-syntax`**.

**Bilder im Dev-Server:** Der Standard-`--listen`-Server liefert nur `/files/` aus, nicht `images/`.
Deshalb enthält die technische Schicht das kleine Server-Plugin **`$:/plugins/wkod/staticfiles`**
(Datei `tiddlers/$__plugins_wkod_staticfiles.tid`), das `images/` und `data/` im Dev-Server unter
`/images/…` bzw. `/data/…` bereitstellt. Es trägt `platform: server` und wird dadurch **aus dem
Offline-Build ausgeschlossen** — die deployte `index.html` bleibt unverändert.

### Statisch bauen

```bash
node ../TiddlyDnD/tiddlywiki.js . --output ./twpage --build index
```

## Deployment & CI (GitHub Actions)

- **`npm-build-pages.yml`** — bei Push auf `master` oder manuell. Installiert die Engine, baut die
  öffentliche `index.html`, kopiert `data/` und `images/` dazu und deployt nach `gh-pages`.
- **`repo-sync.yml`** — nur manuell (`workflow_dispatch`), läuft **in den Forks** (nicht in Base).
  Übernimmt die technische Schicht aus `WkoD/DnDWiki` per gezieltem Pfad-Checkout
  (`tiddlers/`, `tiddlywiki.info`, `.github/`, `CLAUDE.md`) und **nimmt dabei nur die vier
  fork-eigenen Datendateien aus** (`Datum.tid`, `Erfahrungspunkte.tid`, `Spieler.tid`,
  `TBC_Abenteuer.tid`). Danach stößt er automatisch den Build an.

Sync auslösen (Beispiel):

```bash
gh workflow run repo-sync.yml -R WkoD/DnDWiki-Vandalia --ref master
```

## GitHub-Secret: `DISPATCH_PAT`

Der `repo-sync.yml`-Workflow braucht ein Personal Access Token als **Repository-Secret** mit dem
exakten Namen **`DISPATCH_PAT`** (Repo → *Settings → Secrets and variables → Actions*).

**Wozu:** Der eingebaute `GITHUB_TOKEN` darf keine Folge-Workflows auslösen. Der `DISPATCH_PAT` wird
daher genutzt, um (1) die übernommene technische Schicht nach `master` des Forks zu **pushen** und
(2) danach den `npm-build-pages`-Build per `workflow_dispatch` **anzustoßen**.

**Wo nötig:** in **jedem Fork** (`DnDWiki-Vandalia`, `DnDWiki-Tyranny`). In Base ist er der
Vollständigkeit halber gesetzt, wird dort aber **nicht** genutzt (der Sync läuft nicht in Base).

**Benötigte Rechte** — eine der beiden Varianten:

| Token-Typ | Erforderliche Rechte |
|-----------|----------------------|
| **Classic PAT** | Scopes **`repo`** + **`workflow`** |
| **Fine-grained PAT** | Repository-Zugriff auf die 3 Repos; Permissions: **Contents: Read and write**, **Actions: Read and write**, **Workflows: Read and write** (Metadata: Read wird automatisch gesetzt) |

Das Token muss dem Account **`WkoD`** gehören (der Workflow authentifiziert als `WkoD:<token>`).
Fine-grained Tokens können optional **ohne Ablaufdatum** erstellt werden.

**Secret setzen** (mit der GitHub CLI):

```bash
gh secret set DISPATCH_PAT -R WkoD/DnDWiki-Vandalia   # Wert wird versteckt abgefragt
```

**Prüfen, dass die Kette läuft:**

```bash
gh secret list -R WkoD/DnDWiki-Tyranny                 # DISPATCH_PAT vorhanden?
gh workflow run repo-sync.yml -R WkoD/DnDWiki-Tyranny --ref master
gh run list -R WkoD/DnDWiki-Tyranny --workflow repo-sync.yml -L 1
```

Ein erfolgreicher `repo-sync`-Lauf ist vollständig grün (inkl. Schritt *„Dispatch build"*) und
startet automatisch einen `npm-build-pages`-Lauf.
