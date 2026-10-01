#!/usr/bin/env node
import esbuild from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATES_DIR = path.join(__dirname, "templates");
const CONTENT_DIR = path.join(__dirname, "content");
const STATIC_DIR = path.join(__dirname, "static");
const DIST_DIR = path.join(__dirname, "public");

function render(Component, props) {
	return (
		"<!DOCTYPE html>" +
		renderToStaticMarkup(createElement(Component, props))
	);
}

async function loadTemplate(name) {
	const src = path.join(TEMPLATES_DIR, name);
	const out = path.join(DIST_DIR, `_${name}.cjs`);
	await esbuild.build({
		entryPoints: [src],
		bundle: true,
		platform: "node",
		format: "cjs",
		outfile: out,
		external: ["react", "react-dom"],
	});
	const mod = (await import(out)).default;
	return mod.default ?? mod;
}

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true });
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const s = path.join(src, entry.name);
		const d = path.join(dest, entry.name);
		if (entry.isDirectory()) copyDir(s, d);
		else fs.copyFileSync(s, d);
	}
}

function write(filePath, html) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, html, "utf8");
}

function clean() {
	fs.rmSync(DIST_DIR, { recursive: true, force: true });
	console.log("cleaned public");
}

async function build() {
	// clean
	clean();

	// create output directory
	fs.mkdirSync(DIST_DIR, { recursive: true });

	// build blog
	await buildBlog();

	// copy static assets
	if (fs.existsSync(STATIC_DIR)) {
		copyDir(STATIC_DIR, DIST_DIR);
		console.log("  copied: static/");
	}

	// clean up bundled template artifacts
	for (const f of fs
		.readdirSync(DIST_DIR)
		.filter((f) => f.startsWith("_") && f.endsWith(".cjs"))) {
		fs.unlinkSync(path.join(DIST_DIR, f));
	}

	console.log("done.");
}

async function buildBlog() {
	const postsSrc = path.join(CONTENT_DIR, "posts");
	const postsOut = path.join(DIST_DIR, "posts");
	let count = 0;

	fs.mkdirSync(postsOut, { recursive: true });

	// load templates
	const [PageTemplate, IndexTemplate] = await Promise.all([
		loadTemplate("page.jsx"),
		loadTemplate("index.jsx"),
	]);

	// load content files
	const contentFiles = fs
		.readdirSync(postsSrc)
		.filter((f) => f.endsWith(".md"));
	const pages = contentFiles.map((file) => {
		const slug = path.basename(file, ".md");
		const content = marked.parse(
			fs.readFileSync(path.join(postsSrc, file), "utf8")
		);
		return { slug, content };
	});

	// render sub-pages
	for (const page of pages) {
		const html = render(PageTemplate, page);
		write(path.join(postsOut, page.slug, "index.html"), html);
		console.log(`    built: ${page.slug}/index.html`);
		count += 1;
	}

	// render index
	const indexHtml = render(IndexTemplate, { pages });
	write(path.join(DIST_DIR, "index.html"), indexHtml);
	console.log("    built: index.html");

	console.log(`  ${count} page(s) done`);
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
