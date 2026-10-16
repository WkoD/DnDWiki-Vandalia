# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

TiddlyWiki 5 (Node.js edition) for a tabletop role-playing campaign. Internal names (tags, fields, system
tiddlers) are English; what readers see follows the wiki language (`$:/language`). The language
of the campaign content itself is up to the campaign (see `CAMPAIGN.md`).

Commit messages are English by default. If `CAMPAIGN.md` sets a different language for the
campaign, commit messages use that language - check it before committing.

## Documentation - who covers what

- **CLAUDE.md** (here): development support - rules, conventions, editing and release workflow.
- **README.md**: what the project is, how a new campaign is set up, supported languages, the
  license. Its section between the lines `<!-- wiki -->` and `<!-- /wiki -->` also shows in the
  wiki (ControlPanel -> License, see "License").
- **CAMPAIGN.md**: campaign-specific context - an empty skeleton in the template, every
  campaign maintains its own copy (not distributed between repos).

Sort new content accordingly instead of duplicating it. `CLAUDE.md` contains only general
conventions (no campaign data) and is **taken over** from `TiddlyRPG` in a template update (see
"Template update" below); `README.md` and `CAMPAIGN.md` belong to the campaign and are **not**
overwritten. All three files live in the repo root and are ignored by the TiddlyWiki build (it
only reads `tiddlers/`).

## Versioning

Two separate version axes:

- **Format layer** -> pin of `tiddlyrpg-plugins` in `devDependencies` (e.g. `#2.0.0`), versioned
  in the separate repo `TiddlyRPG-Plugins`. Optional content for D&D (the ruleset
  `tiddlyrpg-ruleset-dnd5e2014`, the setting `tiddlyrpg-setting-forgottenrealms`) -> pin of
  `tiddlyrpg-dnd` (e.g. `#2.0.0`), versioned in
  the repo `TiddlyRPG-DnD`; it needs the format layer. For now both keep the same version - pin
  both to the same one.
- **Scaffold template** -> field `version` in `package.json`, set to the `TiddlyRPG` release
  version (e.g. `2.0.0`) - **no** campaign version of its own.

### Raising the format layer version (pin bump)

The format layer is changed, versioned and released **only** in the repo `TiddlyRPG-Plugins` -
see its `CLAUDE.md` -> "Publishing a new version". Here (and in every campaign that wants the
version) only the deliberate pin bump, once a new version is released:

```jsonc
"tiddlyrpg-plugins": "git+https://github.com/WkoD/TiddlyRPG-Plugins.git#2.0.0"
```
```bash
npm install
# npm caches Git tags aggressively - if the new version is not fetched:
rm -rf node_modules package-lock.json && npm install
```

Checklist for the bump:

- Read the release notes. They say whether a version needs a migration and how to do it.
- If the release brings a new language, add it to the table "Languages" in `README.md`
  (in `TiddlyRPG`; campaigns take it over with the next template update if they want).
- `npm install` (and every other `npm install`/`uninstall`/`ci` in the wiki) replaces an existing
  `npm link` to a local `TiddlyRPG-Plugins` checkout with the pinned version. If the wiki is used
  to develop against that checkout, set the link again afterwards: `npm link tiddlyrpg-plugins`,
  and `npm link tiddlyrpg-dnd` if the wiki uses it (see `CLAUDE.md` of `TiddlyRPG-Plugins` ->
  "Checking in a real wiki"). Check with
  `git diff package.json` that the pin is unchanged.

**No auto sync:** a new plugin version reaches a wiki only through this deliberate pin bump -
intended stability/reproducibility.

### Template update (taking over the scaffold from `TiddlyRPG`)

Optional, only if wanted - campaigns do not have to follow:

1. `git remote add upstream https://github.com/WkoD/TiddlyRPG.git` (once)
2. `git fetch upstream --tags`
3. `git diff <own version>..<new version> -- scripts .gitignore .gitattributes .github tiddlywiki.info package.json CLAUDE.md`
   (the versions are tags of the template, e.g. `2.0.0..2.1.0`)
4. Take over the **scaffold + `CLAUDE.md`**, then set `version` in `package.json` to the new
   template version.

**Can be taken over:** **`CLAUDE.md`** (completely - only general conventions, no campaign data),
`scripts/tw.js`, `.gitignore`, `.gitattributes`, `.github/workflows/`,
`tiddlers/license/tiddlywiki.files`, `tiddlywiki.info` (keep the
campaign's `languages` and optional plugins such as `tiddlyrpg-ruleset-dnd5e2014` and
`tiddlyrpg-setting-forgottenrealms`), the `package.json`
structure (scripts/`devDependencies`/plugin pin - **keep `name`/`description`** and optional
packages such as `tiddlyrpg-dnd`), and new/changed
generic standard wiki elements such as the base graph views
`$:/graph/Default`|`Cosmogram`|`Atlas`|`Items` (if not adapted in the campaign; keep the
campaign's captions).

**Never overwrite or discard blindly - campaign-owned:** all lore content in `tiddlers/`,
per-wiki config (SiteTitle/SiteSubtitle/DefaultTiddlers, `$:/language`), `PlayerLevel` with real
data, an own calendar or currency (`$:/config/tiddlyrpg/calendar`, `.../currency` and their
data tiddlers), the choice of ruleset and setting and the rules language
(`$:/config/tiddlyrpg/ruleset`, `.../setting`, `.../rules/...`, `.../date/order`), `images/`, `data/`, the
fields `name`/`description`/`license` in `package.json`, `LICENSE`. For the following additionally check whether new
template functionality can be **merged** instead of discarded unchecked: `README.md` and
`CAMPAIGN.md` (e.g. new sections in the template skeleton) and standard wiki elements **adapted**
in the campaign (e.g. an individualised `Atlas`).

## Commands & CI

```bash
npm install                 # fetch the engine (tiddlywiki) + TiddlyRPG-Plugins (pinned), optionally TiddlyRPG-DnD
npm start                   # local server with live editing (port 8080; another: npm start -- port=8081)
npm run build               # build a static index.html into ./twpage (like the CI)
npm run check               # check every tiddler: the errors and hints below the titles (see "Checks")
```

Both scripts set `TIDDLYWIKI_PLUGIN_PATH` automatically through the launcher `scripts/tw.js`
(built cross-platform from the `plugins` folders of the packages it lists, see "Plugins"). Content changes made in the browser are
written back as `.tid` files; the format layer appears only as read-only shadows.

**CI** (`.github/workflows/npm-build-pages.yml`): on push to `master` or manually - `npm install`,
updates the title/timestamp tiddlers, builds `index.html`, runs `npm run check -- --github` (its
messages as annotations; the step may fail, the deploy goes on), copies `data/` + `images/`,
deploys to `gh-pages` as a single commit without history (`force_orphan`: the page needs only
the latest build, older ones would only grow every clone). The build fails (nothing is deployed)
if TiddlyWiki reports `Cannot find plugin` - for TiddlyWiki itself that is only a warning, and the
page would go out without e.g. the format layer.

The published GitHub Pages copy is deliberately **not savable/read-only**: the same CI step
creates two tiddlers only at build time (never in the Git repo, local `npm start`/`npm run build`
unaffected) - `$:/config/SaverFilter` (empty, so "unsaved changes" is never reported) and
`$:/status/IsReadOnly` (`yes`). `IsReadOnly` is the switch: `tiddlyrpg-core` then adds
the class `trpg-readonly` to the page container and hides edit/clone/delete/new-*/import/manager
and the save button (the same button list as the `tiddlyweb` plugin, which is not part of the
offline build). Locally the server reports `IsReadOnly` = `no`, everything stays editable there.
Important: `IsReadOnly` is compared as an exact string - no trailing newline in the body (hence
`printf` instead of `cat <<EOF` in the workflow file).

## Architecture & content model

### Folder structure

- `tiddlers/` - **flat**, no subfolders for categories. Categorisation is done only through
  **tags**, not through the directory structure. One exception, no content: `tiddlers/license/`
  holds only a `tiddlywiki.files` that loads `LICENSE` and `README.md` of the repo (see
  "License").
  - Content tiddlers: file name from the title, e.g. `Hafendorf.tid` - exact rules under
    "File name and file format" below.
  - System and data tiddlers (`$` prefix, `PlayerLevel`): see "System and data tiddlers" below.
  - The format layer (macros, view templates, hubs, language packs, calendar engine, tw5-graph
    schema) comes from the plugin `tiddlyrpg-core` and does **not** live as a file in the wiki -
    documented in the repo `TiddlyRPG-Plugins`.
- `images/` - sorted by type, folder names in lower case, one per type tag: `person` (NPC
  portraits, also deities), `location`, `event`, `organisation`, `item` (artifacts, items, materials,
  whatever their category), `player`, `information`; plus `map` (maps of locations and spots,
  battle maps among them: field `map`, spot parameter `map`). Images of a spot (parameter
  `image`) are in `location`. Campaign-specific
  subfolders used only for storage (if any): see `CAMPAIGN.md`.
- `data/book/` - in-world lore PDFs, embedded through the field `data` of a book.

### File name and file format

Always create tiddler files **the way TiddlyWiki writes them itself when saving** - otherwise the
first edit in the browser changes file name or format, and the diff shows a rename instead of the
actual change. This also applies when creating them in the IDE or by script.

- **File name** = title with TiddlyWiki's replacements: `/` `\` `:` `<` `>` `|` `?` `*` `"` `^` `~`
  become `_`, umlauts and special characters are transliterated. Examples: `$:/graph/Items` ->
  `$__graph_Items`, `Gründung des Ordens von Hela` -> `Grundung des Ordens von Hela`,
  `Straße nach Süden` -> `Strasse nach Suden`.
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
| `$:/graph/Default` (caption "Live") | Graph view: currently open tiddlers (`$:/StoryList`) of the main types, including automatic `links` edges (wiki links, grey) and the function edges `rules` and `spots`. |
| `$:/graph/Cosmogram` | Graph view: all `Deity`/`Organisation`/`Person`/`Player` tiddlers with their relation fields. |
| `$:/graph/Atlas` | Graph view: all `Location` tiddlers plus all persons/deities/players/organisations - with and without a `location` field -, without the dead and destroyed, connected by the `location` edge and the function edges `rules` (leads a location) and `spots` (part of a location). The places of several worlds and planes, hence not "world map". |
| `$:/graph/Items` | Graph view: `Artifact`/`Item`/`Material` tiddlers (with every category) plus their owners/creators/former owners linked by `owner`/`creator`/`former`, their locations linked by `location` and ingredients linked by `component`. |
| `PlayerLevel` | Body = free text shown as is on the `Player` hub, e.g. `Level 13` or `13456 EXP`; edited directly by the DM. |
| `$:/tiddlyrpg/license`, `$:/tiddlyrpg/license/notice` | The license of the wiki content for ControlPanel -> License: the file `LICENSE` and the section of `README.md` between `<!-- wiki -->` and `<!-- /wiki -->`. No `.tid` files - loaded from the files by `tiddlers/license/tiddlywiki.files`; change the files, not the tiddlers (see "License"). |
| `$:/config/tiddlyrpg/calendar` (optional) | Title of the calendar data tiddler. Set by the plugin `tiddlyrpg-setting-forgottenrealms` (Harptos, package `tiddlyrpg-dnd`) or by the wiki for an own calendar (see "Dates and calendar"). |
| `$:/config/tiddlyrpg/currency` (optional) | Title of the currency data tiddler. Set by `tiddlyrpg-setting-forgottenrealms` (the coins of the Forgotten Realms) or by the wiki for an own currency. |
| `$:/config/tiddlyrpg/ruleset`, `.../setting` (optional) | The active ruleset and campaign setting (plugin title or `none`); without them the only or first installed one is active. Written by Control Panel -> Settings -> TiddlyRPG. |
| `$:/config/tiddlyrpg/date/order` (optional) | Order of day and month in dates: `dm` ("5. Flamerule 1351"), `md` ("Flamerule 5, 1351"); empty or missing: as in the wiki language. Written by Control Panel -> Settings -> TiddlyRPG -> "Campaign setting options". |
| `$:/config/tiddlyrpg/editor/symmetric` (optional) | Whether saving in the editor writes the other end of a symmetric relation (on by default). Written by Control Panel -> Settings -> TiddlyRPG -> Editor. |
| `$:/config/tiddlyrpg/view/dm-published` (optional) | `yes`: the published copy offers the view of the DM as well (see "Player characters, views and secrets"). |
| `$:/config/tiddlyrpg/rules/ruleset/...`, `.../rules/setting/...` (optional) | The rules language, apart for the ruleset (units, dice, damage, terms) and the campaign setting (names of months and coins), the language their terms are shown in: below each `mode` (`wiki`, `all` with `language`, `domain` with `domain/<name>`). Written by Control Panel -> Settings -> TiddlyRPG -> "Ruleset options" and "Campaign setting options"; see "Rules terms". |

The captions of the graph views are plain text of the wiki (tw5-graph shows them untranslated):
English in the template, each campaign may use its own language.

Gitignored (transient, per session/machine, not in git):

| Tiddler | Function |
|---|---|
| `$:/StoryList` | Tiddlers currently open in the story river; written back by the browser on every interaction. |
| `$:/config/flibbles/graph/sidebar` | Remembers which graph view was last open in the sidebar. |

The four graph views live in the wiki on purpose instead of the plugin: the sidebar dropdown only
lists real tiddlers (shadows do not appear there), and e.g. the atlas can carry its own settings
per campaign. The map of a location is no view of its own: it is a tab of the location (see
"Maps of a location") and deliberately not in the dropdown.

### Tiddler format

Standard `.tid` format (field header, blank line, body). Fields of content tiddlers:

- `tags` - several tags separated by spaces; tag names with spaces in `[[double square brackets]]`.
- `image` - image file name(s), comma separated; resolved through the type tag
  (Person/Location/Event/Information/...) to an image from `images/<folder>/`. Several show as
  tabs named after the files, so a file name is a caption (`Kipi (Hirschform).jpg`). An image in
  the body: `<<image "Aufbruch.png">>` (folder of the type), several comma separated as tabs,
  `folder:"event"` for another folder - never `<img src="images/...">`.
- **Relation fields** (list fields referencing titles) - carry the relation network for the graph:
  `location`, `member`, `former`, `leader`, `officer`, `patron`, `mentor`, `under`, `parent`,
  `ancestor`, `spouse`, `sibling`, `family`, `alliance`, `bond`, `enmity` (person/organisation/deity) as well
  as `owner`/`creator`/`former`/`component`/`location` (items). Meaning, edge texts and axes:
  `README.md` of `TiddlyRPG-Plugins` -> "Relations".
  - **Direction:** the field lives on the dependent and points to what it depends on - the member
    to its organisation, the child to its parent (`parent`), the student to the mentor
    (`mentor`), the item to its creator, the potion to its ingredient (`component`), the part to
    the whole. The way back (members, children, students) is never entered; graph and relation
    list show it.
  - **Only the highest of a kind:** `leader` includes `officer` and `member`, `officer` includes
    `member`, `leader` on a location includes `location` there, `parent` includes `ancestor`. Enter only the highest; a lower
    one next to it is neither drawn nor listed (a `location` next to a `leader` on the same place
    gets a hint).
  - **Family:** `parent` on the child (one entry per parent), `ancestor` for a line over several
    generations, `spouse` and `sibling` (real siblings, also without a known parent) on both
    ends, `family` for any other kin - cousins, uncles, adoption and foster families - or where
    the text does not say which. A shared `parent` alone makes no siblings.
  - **`location`** on a person, player or deity: where they are most likely found - the most
    precise place that is still true (someone in Baile has `Baile`, not the kingdom; someone who
    moves between towns gets the region). One entry; more give a hint.
  - **`location`** on an organisation: every place where it sits or is present (office,
    informants, spies) - several entries, all equal; which one is the seat says the text. Named
    spies are persons with `member` and `location`. A secret presence is an entry pointing to a
    location tagged `Secret` or to a locked spot (see "Player characters, views and secrets"):
    path, occupants and map leave it out for the views that do not see it.
  - **`location`** and **`owner`** on an item: an `Artifact` is unique and has one owner **or**
    one location (where it lies, e.g. set into a lighthouse) - never both; when it passes from a
    person to a place, the person moves to `former`. `Item` and `Material` exist several times:
    several owners and several locations (for a material: where it is found), all equal. How
    many there are says the text. More give a hint.
  - **`location`** on a location: it lies in that location ("liegt in", a place of its own within
    a larger one). A part of a location ("Teil von", e.g. a tavern in a town, the base in a
    forest) is instead a **spot** in the body of the larger location (see "Maps of a location");
    who is in the part is found in the larger one. A location has exactly one parent - the
    field or a spot, never both.
  - **`leader`** pointing to a location: leads or controls it (shown as "Controls") and is
    present there - no `location` to the same place.
  - **Tags express no places**: no parent tags on locations, no place tags on events, persons or
    organisations - the fields and spots carry this. Symmetric fields (`spouse`/`sibling`/`family`/
  `alliance`/`bond`/`enmity`) are set on **both** end points - deleting one tiddler must not lose
  the relation for the other - and draw a line with arrows on both sides. Saving in the editor
  in the browser writes, takes out and renames the other end by itself (switch under
  ControlPanel -> Settings -> TiddlyRPG -> Editor); a file written by hand needs both ends set
  by hand. `officer` is
  the intermediate rank between `member` and `leader` (e.g. council leadership), `mentor` the
  individual teacher/student edge. `bond` covers friendship as well as protection and belonging
  without service. `former` means something different depending on the tiddler type (like
  `location`, which is used across types): on person/organisation/deity a former member of an
  organisation, on items a former owner (person/organisation). `component` is directed and points
  from a craftable item (potion/tincture/artifact) to its ingredient items (no quantity - the mere
  existence of the edge).
  The display names come from the language packs - in the relation list a heading per direction
  (`member`: "Mitglied von" / "Mitglieder"), on the graph edges a text read from the dependent
  ("Mitglied von"; every relation its own edge). In edit mode TiddlyWiki shows the raw English
  field names.
- `date` - in-world calendar dates (not the real session date), one syntax for all types (details:
  `README.md` of `TiddlyRPG-Plugins` -> "Dates"). Sections are separated by `,`, a span is
  `start/end`, a point `YYYY`, `YYYY-MM`, `YYYY-MM-DD` or with a time `YYYY-MM-DD-10:00`; `.` is an
  unknown start/end, `..` "since time immemorial"/"ongoing"; whitespace is ignored.
  - **Events:** each section is a point or a span in time (`1351-07-05, 1351-07-22/1351-07-24`;
    still going on: `1351-11-25/..`). `..` (or `.`) as a section of its own, first or last, means
    the event began earlier or goes on, while that section stays what it is (`1351, 1352, ..`,
    `.., 1351`). Only explicit spans are bars in the timeline. Events never count as "dead".
  - **All other types** (person, organisation, location, deity, item, ...): the dates of their
    existence. A single point is the start (`1322` = born 1322, alive); a span with an end marks
    the tiddler as **deceased/destroyed** (`1200/1351-04-14`; only the death known: `./1339`;
    both unknown: `./.`). An unknown side and an open end are shown as `????`. Several sections
    are phases, each but the last with an end, and the last one decides: `./1351-08-04, 1355` =
    died 1351, back since 1355 (alive); `./1351, ./1380` = back at an unknown time, dead again
    in 1380.
  - Below the tags every tiddler with dates shows a date line (right-aligned): an event the span
    of its field (`????` without one), every other type the years of its last phase.
- **Dated sections in event bodies:** the dates live only in `date`. In the body, `<<date>>` marks
  where the next section begins (`<<date 3>>` names the section explicitly, `<<date label:"Caption">>`
  adds a caption that also shows in the timeline and the event table; the caption is wikitext -
  links and macros work, other quotes inside: `<<date label:"Fight at <<unit '30 ft'>>">>`). The placeholder draws the
  rule, the date and the locations linked in its section - no `---` and no hand-written date
  before it. **Every event starts with `<<date>>`**, also one with a single date or none (then
  the heading reads `????`); an event with several sections gives every section a placeholder.
  Text before the first `<<date>>` (an intro) belongs to the head of the event. The block form
  `<$date>…</$date>` (with `section`, `label`) has an end of its own; both forms count on together.
  Inside an HTML element, a table or a `$list` only the block form counts (a hint says so).
  `npm run check` checks the dates of the wiki and the sections and locks of the bodies (see
  "Checks").
- **Quests and rumours** - what is open (a task, a lead, a hint for the players) is **marked in
  the event** where it came up, never kept as a note or a box of its own. The marked text is the
  story itself, so nothing is written twice and every marker has the date of its section.
  Details: `README.md` of `TiddlyRPG-Plugins` -> "Quests".
  - `<<quest "Name">>` at the start of a paragraph or list item (`* <<quest "Name">>Text`) marks
    that paragraph; ordinary text may stand between markers, one dated section can hold several.
    The block form `<$quest name="Name">` (blank line after the tag) marks several paragraphs.
    Only in a dated section of an event.
  - Where something ends: `status:"complete"` or `status:"failed"` on that marker. A later
    marker without status opens the quest again.
  - A tiddler of the name tagged `Quest` makes it a quest - its body is the text for the
    planning, nothing else (no date, status or log: those come from the markers). Without a
    tiddler the name is a rumour, a collection of hints.
  - Two quests that meet at one place: stack the markers (`<<quest "A">><<quest "B">>Text`) -
    they are linked, both ways. No parent and child.
  - Link the places, persons and things in the marked paragraph: the relations, the graph of
    the quest and the maps of locations take them from there (the maps only from the newest
    marker).
  - A quest for some characters only: tag `Secret` and their tags on the quest tiddler. A rumour
    has no tiddler: lock it in the event with `<<secret>>` or `<$secret>`.
  - Rename a quest tiddler in the editor; a rumour on its own page ("Rename") - both rewrite every
    marker. A quest tiddler without a marker and two names one letter apart get a hint (see
    "Checks").
- `price` (items) - with a currency a number and a coin (`price: 50 gp`, `price: 3 gp 5 sp`;
  coin ids as in the currency data, shown with the labels of the rules language), without one a
  plain number. A price that does not fit gets a hint below the title.
- `data` (books) - file name of a PDF from `data/book/`, embedded below the body (instead of an
  `<embed>` in the body).
- `player` - name of the real player: on a `Player` tiddler (an active player character), and
  kept on a figure someone played before (it then becomes a `Person`, its image moves to
  `images/person/`). Both count as player characters for taking part and for secrets; only the
  players of active characters are views to choose.
- `source` - where the images of the tiddler come from, free wikitext shown below it as
  "Source: …": a link, the author, a license, several of them (`source: [[Fandom|https://...]],
  CC BY-SA`). The views that see the tiddler see it; no `<<secret>>` in it.
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
  `modified` bump there, see "Timestamps when editing tiddlers"). The same for the places of
  organisations (`location`) and a change of who leads a location (`leader`). The places of an
  event are the locations linked in its sections (or referenced with `<<spotlink>>`); the
  event list of a location gathers them from all places within it.
- **Maps of a location** - one tiddler per location, no sub-tiddlers:
  - The map (every location has it, also one without a map image, spots or places within) shows
    a graph with the spots and the places within at fixed positions - over the map image if
    there is one; the
    positions are in the field `map-positions` (set by dragging in the tab with "Edit
    positions" while `npm start` runs).
  - `map` - the maps (`images/map/`, several comma separated, battle maps among them). The
    first carries the graph; with two or more each is a tab named after its file.
  - Spots - the places of interest, at the end of the body: `<<spot "Name">>` followed by its
    text, up to the next spot. The name may hold links (`<<spot "Tempel von [[Chauntea]]">>`);
    a spot whose plain name is a tiddler is joined to it (a location then is a part of this
    one), `<<spot "Name" tiddler:"Tiddler">>` joins another one. The block form
    `<$spot name="Name">…</$spot>` has an end of its own. The body shows the text without the
    spots; the spots appear below the maps. A spot joined to another location has no text of its
    own: the map, `<<spotlink>>` and the relation list lead to that location, so its text goes
    there (a hint below the title says so; nothing of it shows there by itself). A spot joined
    to an organisation or a person keeps its text - what it is at this place.
  - Images and maps of a spot without a tiddler of its own:
    `<<spot "Name" image:"a.jpg, b.jpg" map:"c.jpg">>` - below its heading, as tabs from two on,
    then its text. A spot joined to a tiddler shows none: put them into that tiddler.
  - Referencing a spot from another text: `<<spotlink "Baile" "Schloss Baile">>` or with other
    link text `<<spotlink "Miehall" "[[Trunkenen Eulenbären|Zum Trunkenen Eulenbären]]">>` -
    not as `[[Baile#...]]`.

### Dates and calendar

Dates are shown through the calendar engine of `tiddlyrpg-core`. Which calendar applies is set by
`$:/config/tiddlyrpg/calendar`:

- **With a calendar** (e.g. the plugin `tiddlyrpg-setting-forgottenrealms` from the package
  `tiddlyrpg-dnd` in `tiddlywiki.info`: Calendar of Harptos): month names, festivals and era ("11. Flamerule 1351 DR"),
  calculator and day difference on the `Calendar` hub. Festival days are day `days + 1`, ... of
  the preceding month (Midwinter = `1351-01-31`).
- **Without a calendar:** dates appear as entered (`1351-07-11`), no calculator, no `Calendar` in
  the `Information` list.

An own calendar is a copied data tiddler - see `README.md` -> "Calendar".

### Rules terms

With a ruleset (e.g. `tiddlyrpg-ruleset-dnd5e2014`), rules terms in the text are written as
macros, so they follow the rules language of the wiki (see `CAMPAIGN.md` for the choice of the
campaign) - never as plain text when the term matters:

- `<<unit "228 cm">>` (lengths and weights, converted), `<<unit "60 ft" kind:"range">>` (a kind such as
  `range`, `distance` or `size` chooses the display), `<<dice "4d6">>`, `<<damage "1d8 slashing">>`,
  `<<term wis variant:"save">>`, coins `<<unit "3 gp 5 sp">>`. The words of every language are read
  (`<<damage "1W8 Hieb">>`).
- `<<term>>` takes the id of a term: abilities (`<<term wis variant:"save">>`), conditions
  (`<<term charmed>>`), actions (`<<term bonus-action>>`), rests, skills, senses, creature types,
  sizes, alignments, schools of magic, languages. The hub `Ruleset` lists every id with what it
  shows.
- A number always carries its unit - `<<unit 60>>` is not read, also not with a kind - so what a
  text means never depends on a setting. Write the value as the source has it (`228 cm` for a
  person described in centimetres, `60 ft` from the rulebook).
- What a macro does not understand, a macro nothing defines (a typo) and a price
  without coin are errors below the title (see "Checks").
- Details: `README.md` of `TiddlyRPG-Plugins` -> "Rules terms in the text", "Rules language".

### Checks

`tiddlyrpg-core` checks the content with one set of rules (list with ids and levels: `README.md`
of `TiddlyRPG-Plugins` -> "Checks"):

- Below the title of a tiddler stand its **errors** (broken or not working as meant: a date that
  cannot be read, a relation field naming a missing tiddler, a macro nothing defines) and
  **hints** (fine, but better with: no image, a dead link, a symmetric relation on one side
  only) - in the editable wiki only, never in the published copy. Hovering one shows the id of
  its rule.
- `npm run check` reports them for every tiddler in the view of the DM, plus the files in
  `images/` the wiki names, each with its id; exit code 1 if there is an error. Themes after `--`
  run only their rules: `npm run check -- relations links`.
- After a batch of content changes run `npm run check` and look at the new messages. Errors are
  fixed; hints are candidates - judge each (a dangling link is a decision of the DM, see
  "Linking"), do not fix them blindly.
- A message that is right as it is gets switched off at the tiddler: the field `trpg-noerror`
  (errors) or `trpg-noinfo` (hints) with the ids of the rules, e.g. `trpg-noinfo:
  relations/leaders` on an organisation led by a council; present but empty, it switches off
  every message of its level. Only on a decision of the DM - an unwanted message is a reason to
  look at the rule, not to silence it.

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
  the content of individual tiddlers, e.g. a framework change like the switch to tw5-graph or a
  rename of fields or tags that rewrites many tiddlers mechanically.
- **No exception:** batch tasks that make content decisions **per tiddler** (e.g. a linking review
  across many tiddlers, or removing a redundant relation edge) are content changes - even if they
  touch many tiddlers in one run. Update `modified` on each affected tiddler there.

### Tag vocabulary

A tiddler gets up to four kinds of tags:

1. **Type tag** (valid for every campaign), roughly in three categories:
   - **Data** - describe the state of the world, usually undated/long-lived: `Person`,
     `Location`, `Organisation`, `Deity`, `Player`, and for items exactly **one base type** -
     `Artifact` (unique), `Item` (several of it exist), `Material` (raw material, ingredient) -
     plus optional **categories** next to it: `Book`, `Consumable` (potions, tinctures),
     `Equipment` (everything one can equip: weapons, armour, a bag of holding), or one of the
     campaign (a tiddler tagged `$:/tags/tiddlyrpg/ItemKind`). A unique book is `Artifact Book`,
     a newspaper `Item Book`; plenty of items need no category.
   - **Events** - dated/narrative entries: `Event` (a single in-world incident, possibly several
     points in time, see tiddler format). The hub `Campaign` is the pinned start page; there is
     no tag `Campaign` - an event belongs to the campaign when a player character is tagged on it
     (see below).
   - **Quests** - `Quest`: the planning of a quest whose markers stand in events (see "Quests and
     rumours" in "Tiddler format").
   - **Other** - meta/navigation: `Index` (carried by the type hubs; the hub `Index` lists
     them), `Information` (technical tiddlers such as `PlayerLevel`, see above).
2. Faction/story line tag as thematic hub - the concrete names are **campaign-specific** and not
   listed here (see the `CAMPAIGN.md` or the category hub tiddlers of the respective wiki).
   Never a location: places are fields and spots (see "Relation fields").
3. **Player characters** who took part - on events the characters that were there (`Theren
   Ragna`), active or former (field `player`). This also makes the event a campaign event
   (event table, timeline).
4. **`Secret`** - locks the tiddler: only the DM and the players of the player characters tagged
   on it see it (`Theren Secret`: Theren's player; `Secret` alone: the DM only).

### Player characters, views and secrets

The page control "View" (sidebar) switches between the public view, the view of one player and
the view of the DM; the editable wiki opens as the DM, the published copy as public (the DM view
there only with `$:/config/tiddlyrpg/view/dm-published` = `yes` in `tiddlers/`). No access
control - the repository holds everything. Details: `README.md` of `TiddlyRPG-Plugins` ->
"Player characters, views and secrets".

- A whole tiddler: tag `Secret` (plus the characters it is for).
- Part of a body: `<<secret "Theren" "Actia">>` directly before or after a `<<date>>`/`<<spot>>`
  locks that whole section (at the very start of the body: the text before the first marker);
  `<$secret for="Theren Actia">…</$secret>` locks exactly what it encloses. No character: the DM
  only. A locked section is missing everywhere for the views that do not see it (dates,
  locations, spots, search).
- Lock only with these: a `$list`/`<%if%>` of one's own on the view hides the text but not its
  dates, locations and spots, and a transcluded secret tiddler shows wherever it is transcluded
  (both are errors below the title, see "Checks").

Type tags are always the English internal names. On display they appear in the wiki language
(`Location` reads "Ort" in German) - in headings, tag pills, lists and the search. A tag typed in
the wiki language ("Ort") is stored as `Location` when saving in the browser. When editing files
directly, always write the internal name.

**Tag colours:** a tiddler that serves as a tag gets the colour of its type automatically (an
organisation as faction tag orange, a location red). An own `color` field is only needed if a tag
should deliberately differ - then it wins.

### Plugins (`tiddlywiki.info`, delivered from `TiddlyRPG-Plugins`)

`tiddlywiki/tiddlyweb`, `tiddlywiki/filesystem`, `tiddlywiki/highlight` (official, from the npm
engine), `tiddlyrpg-core` (format layer), `staticfiles` (dev server), `graph` + `vis-network` +
`relink` (`flibbles/tw5-graph` stack), optionally `tiddlyrpg-ruleset-dnd5e2014` (rules terms of
D&D 5e) and `tiddlyrpg-setting-forgottenrealms` (Calendar of Harptos, coins of the Forgotten Realms), both from
the package `tiddlyrpg-dnd`, repo `TiddlyRPG-DnD`. Language packs of TiddlyWiki
under `"languages"`. Contents/documentation of the plugins: see `CLAUDE.md` and `README.md` in
`TiddlyRPG-Plugins` and `TiddlyRPG-DnD`. The launcher `scripts/tw.js` lists the packages whose
`plugins` folders it searches; a package that is not installed is skipped.

Every plugin brings its tabs "readme" and "license" itself (from the `README.md` and `LICENSE` of
its repo); ControlPanel -> License lists every plugin with its license. A third-party plugin
without a tab "license" shows "not stated" there unless `$:/config/tiddlyrpg/licenses` names it
(see `CLAUDE.md` of `TiddlyRPG-Plugins` -> "Readme and license of a plugin").

### License

The license of the wiki content lives **once**, in the repo root, and shows in the wiki under
ControlPanel -> License (also in the published copy):

- `LICENSE` - the license text (`"license"` in `package.json` with its SPDX name). The template:
  CC0 1.0.
- `README.md`, section "License" between the lines `<!-- wiki -->` and `<!-- /wiki -->` - what
  the reader should know: the license in one sentence and, for content of others, their notice.
  Only Markdown the format layer reads (headings, paragraphs, lists, tables, code, bold, links;
  `README.md` of `TiddlyRPG-Plugins` -> "Licenses in the wiki"); no wikitext, it is not parsed.
- `tiddlers/license/tiddlywiki.files` loads both as `$:/tiddlyrpg/license` and
  `$:/tiddlyrpg/license/notice` - taken over from the template, never edited per campaign.
- A campaign with content of Wizards of the Coast (D&D, the Forgotten Realms, an official
  adventure) is fan content: the Fan Content Policy wants it free for everyone to use without
  credit - hence CC0 for the own content, not CC-BY or GPL - and its notice word for word in the
  section: "[Title] is unofficial Fan Content permitted under the Fan Content Policy. Not
  approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the
  Coast. ©Wizards of the Coast LLC." Never logos; text, maps and images copied from a book are
  not covered by it.
- Where the images of a tiddler come from: the field `source` (see "Tiddler format").
