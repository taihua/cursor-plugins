#!/usr/bin/env node
// Tracks which upstream (cursor/plugins) file version each zh-TW translation is based on.
//
//   node zh-TW/tools/sync.mjs status          fetch upstream and list changed / new / removed files
//   node zh-TW/tools/sync.mjs diff [path...]  show the English diff since each file was translated
//   node zh-TW/tools/sync.mjs mark <path...>  record the current upstream version as translated
//   node zh-TW/tools/sync.mjs mark --all      same, for every changed file
//   node zh-TW/tools/sync.mjs init <commit>   (re)build the manifest from one upstream commit
//
// Paths are upstream paths such as pstack/skills/how/SKILL.md.
// The translation of upstream path P lives at zh-TW/P (zh-TW/README.md for the root README.md).

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MANIFEST = join(ROOT, "zh-TW", "sync-manifest.json");
const UPSTREAM_URL = "https://github.com/cursor/plugins.git";
const UPSTREAM_REF = "refs/remotes/upstream/main";

const TRACKED = (p) =>
	(p === "README.md" || p.startsWith("pstack/")) &&
	/\.(md|ya?ml|tsv)$/.test(p) &&
	!p.startsWith("pstack/skills/statechart/scripts/");

const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 }).trimEnd();
const zhPath = (p) => join("zh-TW", p);

function fetchUpstream() {
	git("fetch", "--quiet", UPSTREAM_URL, `+refs/heads/main:${UPSTREAM_REF}`);
	return git("rev-parse", UPSTREAM_REF);
}

function treeBlobs(commit) {
	const out = git("ls-tree", "-r", commit, "--", "README.md", "pstack");
	const blobs = {};
	for (const line of out.split("\n")) {
		const m = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
		if (m && TRACKED(m[2])) blobs[m[2]] = m[1];
	}
	return blobs;
}

const load = () => JSON.parse(readFileSync(MANIFEST, "utf8"));
const save = (m) => writeFileSync(MANIFEST, JSON.stringify(m, null, "\t") + "\n");

function compare(manifest, upstream) {
	const changed = [], added = [], removed = [];
	for (const [p, blob] of Object.entries(upstream)) {
		if (!(p in manifest.files)) {
			if (!existsSync(join(ROOT, zhPath(p)))) added.push(p);
		} else if (manifest.files[p] !== blob) changed.push(p);
	}
	for (const p of Object.keys(manifest.files)) if (!(p in upstream)) removed.push(p);
	return { changed: changed.sort(), added: added.sort(), removed: removed.sort() };
}

const [cmd = "status", ...args] = process.argv.slice(2);

if (cmd === "init") {
	const commit = git("rev-parse", args[0] ?? "HEAD");
	const files = {};
	for (const [p, blob] of Object.entries(treeBlobs(commit))) if (existsSync(join(ROOT, zhPath(p)))) files[p] = blob;
	save({ upstream: UPSTREAM_URL, translatedAt: commit, files });
	console.log(`manifest: ${Object.keys(files).length} files at ${commit.slice(0, 7)}`);
	process.exit(0);
}

const manifest = load();
const head = fetchUpstream();
const upstream = treeBlobs(head);
const { changed, added, removed } = compare(manifest, upstream);

if (cmd === "status") {
	console.log(`upstream main: ${head.slice(0, 7)}   last full sync: ${manifest.translatedAt.slice(0, 7)}`);
	const stat = (p) => {
		const s = git("diff", "--numstat", manifest.files[p], upstream[p]).split("\t");
		return `+${s[0]} -${s[1]}`;
	};
	console.log(`\n需要更新（英文已改）: ${changed.length}`);
	for (const p of changed) console.log(`  ${p}  (${stat(p)})  -> ${zhPath(p)}`);
	console.log(`\n新增（還沒有中文版）: ${added.length}`);
	for (const p of added) console.log(`  ${p}  -> ${zhPath(p)}`);
	console.log(`\n官方已刪除（中文版可以刪掉）: ${removed.length}`);
	for (const p of removed) console.log(`  ${zhPath(p)}`);
	process.exit(0);
}

if (cmd === "diff") {
	const targets = args.length ? args : changed;
	for (const p of targets) {
		if (!manifest.files[p] || !upstream[p]) { console.log(`skip ${p}: not a changed tracked file`); continue; }
		console.log(`\n===== ${p}  ->  ${zhPath(p)}`);
		console.log(git("diff", "--no-color", manifest.files[p], upstream[p]));
	}
	process.exit(0);
}

if (cmd === "mark") {
	const targets = args[0] === "--all" ? [...changed, ...added.filter((p) => existsSync(join(ROOT, zhPath(p))))] : args;
	for (const p of targets) {
		if (!upstream[p]) { console.error(`not in upstream: ${p}`); process.exit(1); }
		if (!existsSync(join(ROOT, zhPath(p)))) { console.error(`no translation yet: ${zhPath(p)}`); process.exit(1); }
		manifest.files[p] = upstream[p];
	}
	for (const p of removed) if (!existsSync(join(ROOT, zhPath(p)))) delete manifest.files[p];
	if (compare(manifest, upstream).changed.length === 0) manifest.translatedAt = head;
	save(manifest);
	console.log(`marked ${targets.length} file(s)`);
	process.exit(0);
}

console.error(`unknown command: ${cmd}`);
process.exit(1);
