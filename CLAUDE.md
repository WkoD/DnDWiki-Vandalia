# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

TiddlyWiki 5 (Node.js edition) for a D&D campaign. Internal names (tags, fields, system
tiddlers) are English; what readers see follows the wiki language (`$:/language`). The language
of the campaign content itself is up to the campaign (see `CAMPAIGN.md`).

## Documentation - who covers what

- **CLAUDE.md** (here): development support - rules, conventions, editing and release workflow.
- **README.md**: what the project is, how a new campaign is set up, supported languages.
- **CAMPAIGN.md**: campaign-specific context - an empty skeleton in the template, every
  campaign maintains its own copy (not distributed between repos).

Sort new content accordingly instead of duplicating it. `CLAUDE.md` contains only general
conventions (no campaign data) and is **taken over** from `DnDWiki` in a template update (see
"Template update" below); `README.md` and `CAMPAIGN.md` belong to the campaign and are **not**
overwritten. All three files live in the repo root and are ignored by the TiddlyWiki build (it
only reads `tiddlers/`).

## Versioning

Two separate version axes:

- **Format layer** -> pin of `tiddlydnd-plugins` in `devDependencies` (e.g. `#2.0.0`), versioned
  in the separate repo `TiddlyDnD-Plugins`.
- **Scaffold template** -> field `version` in `package.json`, set to the `DnDWiki` release
  version (e.g. `2.0.0`) - **no** campaign version of its own.

### Raising the format layer version (pin bump)

The format layer is changed, versioned and released **only** in the repo `TiddlyDnD-Plugins` -
see its `CLAUDE.md` -> "Publishing a new version". Here (and in every campaign that wants the
version) only the deliberate pin bump, once a new version is released:

```jsonc
"tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#2.0.0"
```
```bash
npm install
# npm caches Git tags aggressively - if the new version is not fetched:
rm -rf node_modules package-lock.json && npm install
```

Checklist for the bump:

- Read the release notes. A major version may need a migration
  (`TiddlyDnD-Plugins/scripts/migrate-<version>.js`, dry run first).
- If the release brings a new language, add it to the table "Languages" in `README.md`
  (in `DnDWiki`; campaigns take it over with the next template update if they want).
- `npm install` (and every other `npm install`/`uninstall`/`ci` in the wiki) replaces an existing
  `npm link` to a local `TiddlyDnD-Plugins` checkout with the pinned version. If the wiki is used
  to develop against that checkout, set the link again afterwards: `npm link tiddlydnd-plugins`
  (see `CLAUDE.md` of `TiddlyDnD-Plugins` -> "Checking in a real wiki"). Check with
  `git diff package.json` that the pin is unchanged.

**No auto sync:** a new plugin version reaches a wiki only through this deliberate pin bump -
intended stability/reproducibility.

### Template update (taking over the scaffold from `DnDWiki`)

Optional, only if wanted - campaigns do not have to follow:

1. `git remote add template https://github.com/WkoD/DnDWiki.git` (once)
2. `git fetch template --tags`
3. `git diff template/<own version>..template/<new version> -- scripts .gitignore .gitattributes .github tiddlywiki.info package.json CLAUDE.md`
4. Take over the **scaffold + `CLAUDE.md`**, then set `version` in `package.json` to the new
   template version.

**Can be taken over:** **`CLAUDE.md`** (completely - only general conventions, no campaign data),
`scripts/tw.js`, `.gitignore`, `.gitattributes`, `.github/workflows/`, `tiddlywiki.info` (keep the
campaign's `languages` and optional plugins such as `dndwiki-forgottenrealms`), the `package.json`
structure (scripts/`devDependencies`/plugin pin - **keep `name`/`description`**), and new/changed
generic standard wiki elements such as the base graph views
`$:/graph/Default`|`Cosmogram`|`WorldMap`|`Items` (if not adapted in the campaign; keep the
campaign's captions).

**Never overwrite or discard blindly - campaign-owned:** all lore content in `tiddlers/`,
per-wiki config (SiteTitle/SiteSubtitle/DefaultTiddlers, `$:/language`), `PlayerLevel` with real
data, an own calendar (`$:/config/dndwiki/calendar` and its data tiddler), `images/`, `data/`, the
fields `name`/`description` in `package.json`. For the following additionally check whether new
template functionality can be **merged** instead of discarded unchecked: `README.md` and
`CAMPAIGN.md` (e.g. new sections in the template skeleton) and standard wiki elements **adapted**
in the campaign (e.g. an individualised `WorldMap` with background image/positions).

## Commands & CI

```bash
npm install                 # fetch the engine (tiddlywiki) + TiddlyDnD-Plugins (pinned)
npm start                   # local server with live editing (default port 8080)
npm run build               # build a static index.html into ./twpage (like the CI)
```

Both scripts set `TIDDLYWIKI_PLUGIN_PATH` automatically through the launcher `scripts/tw.js`
(built cross-platform from all `node_modules/*/plugins`). Content changes made in the browser are
written back as `.tid` files; the format layer appears only as read-only shadows.

**CI** (`.github/workflows/npm-build-pages.yml`): on push to `master` or manually - `npm install`,
updates the title/timestamp tiddlers, builds `index.html`, copies `data/` + `images/`, deploys to
`gh-pages`. The build fails (nothing is deployed) if TiddlyWiki reports
`Cannot find plugin` - for TiddlyWiki itself that is only a warning, and the page would go out
without e.g. the format layer.

The published GitHub Pages copy is deliberately **not savable/read-only**: the same CI step
creates two tiddlers only at build time (never in the Git repo, local `npm start`/`npm run build`
unaffected) - `$:/config/SaverFilter` (empty, so "unsaved changes" is never reported) and
`$:/status/IsReadOnly` (`yes`). `IsReadOnly` is the switch: `dndwiki-core` (from 1.4.1) then adds
the class `dnd-readonly` to the page container and hides edit/clone/delete/new-*/import/manager
and the save button (the same button list as the `tiddlyweb` plugin, which is not part of the
offline build). Locally the server reports `IsReadOnly` = `no`, everything stays editable there.
Important: `IsReadOnly` is compared as an exact string - no trailing newline in the body (hence
`printf` instead of `cat <<EOF` in the workflow file).

## Architecture & content model

### Folder structure

- `tiddlers/` - **flat**, no subfolders for categories. Categorisation is done only through
  **tags**, not through the directory structure.
  - Content tiddlers: file name from the title, e.g. `Hafendorf.tid` - exact rules under
    "File name and file format" below.
  - System and data tiddlers (`$` prefix, `PlayerLevel`): see "System and data tiddlers" below.
  - The format layer (macros, view templates, hubs, language packs, calendar engine, tw5-graph
    schema) comes from the plugin `dndwiki-core` and does **not** live as a file in the wiki -
    documented in the repo `TiddlyDnD-Plugins`.
- `images/` - sorted by type, folder names in lower case, one per type tag: `person` (NPC
  portraits, also deities), `location`, `event`, `organisation`, `item` (artifacts, books, items,
  materials), `map` (overview maps), `battlemap` (battle maps), `player`. Campaign-specific
  subfolders used only for storage (if any): see `CAMPAIGN.md`.
- `data/book/` - in-world lore PDFs.

### File name and file format

Always create tiddler files **the way TiddlyWiki writes them itself when saving** - otherwise the
first edit in the browser changes file name or format, and the diff shows a rename instead of the
actual change. This also applies when creating them in the IDE or by script.

- **File name** = title with TiddlyWiki's replacements: `/` `\` `:` `<` `>` `|` `?` `*` `"` `^` `~`
  become `_`, umlauts and special characters are transliterated. Examples: `$:/graph/Items` ->
  `$__graph_Items`, `Gründung des Ordens von Hela` -> `Grundung des Ordens von Hela`,
  `Straße nach Süden` -> `Strasse nach Suden`, `Miehall/Map` -> `Miehall_Map`.
- **Format** depends only on the field `type`: wikitext (`text/vnd.tiddlywiki`, the default) ->
  one `.tid` file; **any other type** -> content file plus `.meta` with the fields. The graph views
  (`type: application/json`) therefore live as `$__graph_<name>.json` + `$__graph_<name>.json.meta`.
- **Pitfall:** a `.json` file **without** its `.meta` is read by TiddlyWiki as a list of several
  tiddlers, not as one. Always create, rename and delete both files together.
- The safest way to create the files is TiddlyWiki's own logic instead of doing it by hand:
  `$tw.utils.generateTiddlerFileInfo` (name and format) and `$tw.utils.saveTiddlerToFileSync`
  (writing), both in `node_modules/tiddlywiki/core-server/filesystem.js`.

### System and data tiddlers

Technical tiddlers with a fixed function given by the format (no lore content):

| Tiddler | Function |
|---|---|
| `$:/SiteTitle` | Wiki title (browser tab/header). Empty in the template - the CI enters the repo name at build time. |
| `$:/SiteSubtitle` | Subtitle. Empty in the template - the CI enters a timestamp at build time. |
| `$:/DefaultTiddlers` | List of tiddlers shown in the story river when the wiki opens. |
| `$:/language` | Active language, e.g. `$:/languages/de-DE` (needs `"languages"` in `tiddlywiki.info` for anything but en-GB). Supported languages: `README.md` -> "Languages". A language switch in the Control Panel during `npm start` writes this tiddler. |
| `$:/graph/Default` (caption "Live") | Graph view: currently open tiddlers (`$:/StoryList`) of the main types, including automatic `links` edges (wiki links). |
| `$:/graph/Cosmogram` | Graph view: all `Deity`/`Organisation`/`Person`/`Player` tiddlers with their relation fields. |
| `$:/graph/WorldMap` | Graph view: all `Location` tiddlers plus all living persons/deities/players/organisations - with and without a `location` field -, connected by the `location` edge. |
| `$:/graph/Items` | Graph view: `Artifact`/`Book`/`Item`/`Material` tiddlers plus their owners/creators/former owners linked by `owner`/`creator`/`former` and ingredients linked by `component`. |
| `PlayerLevel` | Body = free text shown as is on the `Player` hub, e.g. `Level 13` or `13456 EXP`; edited directly by the DM. |
| `$:/config/dndwiki/calendar` (optional) | Title of the calendar data tiddler. Set by the plugin `dndwiki-forgottenrealms` (Harptos) or by the wiki for an own calendar (see "Dates and calendar"). |

The captions of the graph views are plain text of the wiki (tw5-graph shows them untranslated):
English in the template, each campaign may use its own language.

Gitignored (transient, per session/machine, not in git):

| Tiddler | Function |
|---|---|
| `$:/StoryList` | Tiddlers currently open in the story river; written back by the browser on every interaction. |
| `$:/config/flibbles/graph/sidebar` | Remembers which graph view was last open in the sidebar. |

The four graph views live in the wiki on purpose instead of the plugin: the sidebar dropdown only
lists real tiddlers (shadows do not appear there), and e.g. the world map can carry its own
background/positions per campaign.

### Tiddler format

Standard `.tid` format (field header, blank line, body). Fields of content tiddlers:

- `tags` - several tags separated by spaces; tag names with spaces in `[[double square brackets]]`.
- `image` - image file name(s), comma separated; resolved through the type tag
  (Person/Location/Event/...) to an image from `images/<folder>/`.
- **Relation fields** (list fields referencing titles) - carry the relation network for the graph:
  `location`, `member`, `former`, `leader`, `officer`, `patron`, `mentor`, `under`, `family`,
  `alliance`, `bond`, `enmity` (person/organisation/deity) as well as
  `owner`/`creator`/`former`/`component` (items). Symmetric fields (`family`/`alliance`/`bond`/
  `enmity`) are set on **both** end points and draw a line with arrows on both sides. `officer` is
  the intermediate rank between `member` and `leader` (e.g. council leadership), `mentor` the
  individual teacher/student edge. `bond` covers friendship as well as protection and belonging
  without service. `former` means something different depending on the tiddler type (like
  `location`, which is used across types): on person/organisation/deity a former member of an
  organisation, on items a former owner (person/organisation). `component` is directed and points
  from a craftable item (potion/tincture/artifact) to its ingredient items (no quantity - the mere
  existence of the edge).
  The display names of these fields come from the language packs (e.g. `location` reads "Ort" in
  German) - in the relation list and on the graph edges. In edit mode TiddlyWiki shows the raw
  English field names.
- `date` - in-world calendar date (not the real session date), format `YYYY-MM-DD`, optionally with
  a time `YYYY-MM-DD-10:00`; also `YYYY` or `YYYY-MM`. **Deceased convention:** a **dot anywhere in
  the `date` value** (e.g. `.1350-07` as prefix, or `1200.1351-04-14` as birth.death date) marks a
  person/character as deceased. For **events** the dot separates several points in time instead
  (`1351-06-27.1351-11-19`); a dot at the end marks an open end (`1351-11-25.1351-12-02.`). Events
  therefore never count as "dead".
- `price` (items) - shown with the currency unit of the language pack.
- `player` (on `Player` tiddlers) - name of the real player.
- `link` - "see also" line under the tiddler, e.g. `[ext[Title|data/book/file.pdf]]`.
- **Linking:** the body consistently uses `[[WikiLinks]]` for explicit links between
  persons/locations/organisations - this is the primary network mechanism next to the tags. No
  freelinks plugin -> every mention of an existing tiddler title needs a real link. Order of
  preference (preferred first, the rest only if needed):
  1. Direct link `[[Title]]` for an exact occurrence.
  2. With inflection: attach the suffix outside the brackets (`[[Title]]s`, `[[Title]]er`, ...).
  3. If the suffix does not fit grammatically (case/preposition change): minimal rephrasing that
     makes the base form linkable (German example: "vom [[Königreich von Vandalia]]" instead of
     "des [[Königreiches von Vandalia|Königreich von Vandalia]]").
  4. `[[Alias|Title]]` only as a last resort - real aliases/code names or deliberately different
     link text. Links to type hubs use an alias in the content language (`[[Ort|Location]]`).

  No blind mass linking: check every mention (real wiki entity vs. external reference/quote/
  generic word). Mentions of tiddlers that do not exist yet (dangling) are not created or linked
  automatically - present them to the DM for a decision.
- **Event maintenance:** when creating or editing an `Event` tiddler, check whether the persons
  mentioned in it (linked or not) get a new, more recent whereabouts through the event - if so,
  update the `location` field of the affected person tiddlers in the same go (including the
  `modified` bump there, see "Timestamps when editing tiddlers").
- **Sub-tiddlers of a location:** `<location>/Map` (tag `Map`, overview map) and
  `<location>/BattleMap` (tag `BattleMap`, battle map), each with `image` and optional text. The
  location shows them as tabs after its relations; a sub-tiddler tagged with a player character
  is hidden for other players like any tiddler.

### Dates and calendar

Dates are shown through the calendar engine of `dndwiki-core`. Which calendar applies is set by
`$:/config/dndwiki/calendar`:

- **With a calendar** (e.g. the plugin `dndwiki-forgottenrealms` in `tiddlywiki.info`: Calendar
  of Harptos): long form with month names, festivals and era ("1351 DR, 11. Flamerule (07)"),
  calculator and day difference on the `Calendar` hub. Festival days are day `days + 1`, ... of
  the preceding month (Midwinter = `1351-01-31`).
- **Without a calendar:** dates appear as entered (`1351-07-11`), no calculator, no `Calendar` in
  the `Information` list.

An own calendar is a copied data tiddler - see `README.md` -> "Calendar".

### Timestamps when editing tiddlers (`created`/`modified`)

`created` is the creation time, `modified` the time of the last content change. Format: UTC,
`YYYYMMDDHHMMSSmmm` (17 digits, e.g. `20241112143212015` = 2024-11-12 14:32:12.015 UTC) - the way
TiddlyWiki writes it when editing in the browser.

When editing **outside** TiddlyWiki (IDE, Claude, scripts) the same care applies by hand:

- **New tiddler:** set `created` to the real current timestamp; `modified` to the same value.
- **Existing tiddler changes in content** - for every tiddler, content as well as system/data
  tiddlers (body, relation/graph fields, other fields such as `tags`/`image`/`date`, a changed
  graph view filter line etc.): set `modified` to the real current timestamp. `created` stays.
- **Exception - no timestamp change:** technical mass changes without an editorial decision about
  the content of individual tiddlers, e.g. a framework change like the tw5-graph migration or the
  2.0 migration to English internal names, which rewrote fields/schema mechanically across many
  tiddlers.
- **No exception:** batch tasks that make content decisions **per tiddler** (e.g. a linking review
  across many tiddlers, or removing a redundant relation edge) are content changes - even if they
  touch many tiddlers in one run. Update `modified` on each affected tiddler there.

### Tag vocabulary

Every tiddler typically gets two kinds of tags:

1. **Type tag** (valid for every campaign), roughly in three categories:
   - **Data** - describe the state of the world, usually undated/long-lived: `Person`,
     `Location`, `Organisation`, `Deity`, `Player`, `Artifact`, `Item`, `Book`, `Material`, `Map`,
     `BattleMap`.
   - **Events** - dated/narrative entries: `Event` (a single in-world incident, possibly several
     points in time, see tiddler format), `Campaign` (marks an event as a chapter of the
     campaign, played with the player characters; the hub `Campaign` is the pinned start page).
   - **Other** - meta/navigation: `Index` (entry point), `Information` (technical tiddlers such as
     `PlayerLevel`, see above).
2. Faction/story line tag as thematic hub - the concrete names are **campaign-specific** and not
   listed here (see the `CAMPAIGN.md` or the category hub tiddlers of the respective wiki).

Type tags are always the English internal names. On display they appear in the wiki language
(`Location` reads "Ort" in German) - in headings, tag pills, lists and the search. A tag typed in
the wiki language ("Ort") is stored as `Location` when saving in the browser. When editing files
directly, always write the internal name.

**Tag colours:** a tiddler that serves as a tag gets the colour of its type automatically (an
organisation as faction tag orange, a location red). An own `color` field is only needed if a tag
should deliberately differ - then it wins.

### Plugins (`tiddlywiki.info`, delivered from `TiddlyDnD-Plugins`)

`tiddlywiki/tiddlyweb`, `tiddlywiki/filesystem`, `tiddlywiki/highlight` (official, from the npm
engine), `dndwiki-core` (D&D format layer), `staticfiles` (dev server), `graph` + `vis-network` +
`relink` (`flibbles/tw5-graph` stack), optionally `dndwiki-forgottenrealms` (Calendar of Harptos).
Language packs of TiddlyWiki under `"languages"`. Contents/documentation of the plugins: see
`CLAUDE.md` and `README.md` in `TiddlyDnD-Plugins`.
