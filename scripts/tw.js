#!/usr/bin/env node
/*
 * Cross-platform TiddlyWiki launcher.
 *
 * Assembles TIDDLYWIKI_PLUGIN_PATH from the individually pinned plugin
 * packages in node_modules (each ships its plugins under <pkg>/plugins),
 * joined with the OS-specific path delimiter (";" on Windows, ":" elsewhere)
 * — which is what TiddlyWiki's boot splits on. A package that is not installed
 * is skipped.
 *
 * Also suppresses Node's DEP0169 (url.parse) warning that TiddlyWiki's core
 * server still triggers — the cross-platform equivalent of NODE_OPTIONS=--no-deprecation.
 */
process.noDeprecation = true;

var path = require("path");
var fs = require("fs");

var nodeModules = path.join(__dirname, "..", "node_modules");

// First-party bundle (wkod/*) + individually pinned third-party plugin repos.
// Each entry contributes its `plugins` directory to the search path.
var pluginPackages = [
	"tiddlyrpg-plugins", // wkod/tiddlyrpg-core, wkod/staticfiles
	"tiddlyrpg-dnd",     // wkod/tiddlyrpg-ruleset-dnd5e2014, wkod/tiddlyrpg-setting-forgottenrealms (optional)
	"tw5-graph",         // flibbles/graph (folder: plugins/graph)
	"tw5-vis-network",   // flibbles/vis-network (folder: plugins/vis-network)
	"tw5-relink"         // flibbles/relink (folder: plugins/relink)
];

var pluginPaths = pluginPackages
	.map(function(pkg) { return path.join(nodeModules, pkg, "plugins"); })
	.filter(function(p) { return fs.existsSync(p); });

process.env.TIDDLYWIKI_PLUGIN_PATH = pluginPaths.join(path.delimiter);

var $tw = require("tiddlywiki").TiddlyWiki();
$tw.boot.argv = Array.prototype.slice.call(process.argv, 2);
$tw.boot.boot();
