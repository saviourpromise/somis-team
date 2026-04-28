#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const publicAssets = path.join(root, "public", "assets");
const distAssets = path.join(dist, "assets");

// ── 1. Clean & create dist ────────────────────────────────────────────────
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(distAssets, { recursive: true });

// ── 2. Copy public/assets → dist/assets ───────────────────────────────────
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
}
copyDir(publicAssets, distAssets);

// ── 3. Write index.html ────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Somi Product List</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; overflow: hidden; }
      iframe { display: block; width: 100%; height: 100%; border: none; }
    </style>
  </head>
  <body>
    <iframe
      src="assets/SOMI STEAM NEW PRICE LIST.pdf"
      title="Somi Product List"
    ></iframe>
  </body>
</html>
`;

fs.writeFileSync(path.join(dist, "index.html"), html, "utf8");

console.log("✅  Build complete!");
console.log("   dist/index.html");
console.log("   dist/assets/");
for (const f of fs.readdirSync(distAssets)) console.log(`     └── ${f}`);
