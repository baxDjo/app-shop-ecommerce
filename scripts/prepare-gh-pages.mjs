import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexFile = path.join(distDir, "index.html");
const notFoundFile = path.join(distDir, "404.html");

try {
  await access(indexFile, constants.F_OK);
  await copyFile(indexFile, notFoundFile);
  console.log("Prepared dist/404.html for GitHub Pages SPA routing.");
} catch (error) {
  console.warn("Skipping GitHub Pages 404 preparation:", error);
}
