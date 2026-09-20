import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
let before = 0, after = 0;
const assets = walk("public/images").filter(f => f.endsWith(".png"));
for (const file of assets) {
  const target = file.replace(/\.png$/, ".webp");
  before += fs.statSync(file).size;
  await sharp(file).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 85 }).toFile(target);
  after += fs.statSync(target).size;
}
for (const file of walk("src").filter(f => /\.(tsx?|css)$/.test(f))) {
  let s = fs.readFileSync(file, "utf8");
  for (const asset of assets) s = s.replaceAll(asset.replaceAll("\\", "/").replace(/^public/, ""), asset.replaceAll("\\", "/").replace(/^public/, "").replace(/\.png$/, ".webp"));
  fs.writeFileSync(file, s);
}
console.log(JSON.stringify({ images: assets.length, beforeBytes: before, afterBytes: after }));
