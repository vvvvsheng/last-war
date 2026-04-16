import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function networkUrls(serverPort) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const records of Object.values(interfaces)) {
    for (const record of records || []) {
      if (record.family === "IPv4" && !record.internal) {
        urls.push(`http://${record.address}:${serverPort}`);
      }
    }
  }

  return urls;
}

function contentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function safePath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const candidate = normalized === "/" ? "/index.html" : normalized;
  return path.join(root, candidate);
}

async function resolveFile(filePath) {
  const stats = await fs.stat(filePath).catch(() => null);

  if (stats?.isDirectory()) {
    const indexPath = path.join(filePath, "index.html");
    const indexStats = await fs.stat(indexPath).catch(() => null);
    if (indexStats?.isFile()) return indexPath;
  }

  if (stats?.isFile()) return filePath;

  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const requestedPath = safePath(req.url || "/");
    let filePath = await resolveFile(requestedPath);

    if (!filePath && !path.extname(requestedPath)) {
      filePath = await resolveFile(`${requestedPath}.html`);
    }

    if (!filePath) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const body = await fs.readFile(filePath);
    res.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": contentType(filePath),
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`500 Internal Server Error\n${error instanceof Error ? error.message : String(error)}`);
  }
});

server.listen(port, host, () => {
  console.log(`Last War server running on http://localhost:${port}`);
  const urls = networkUrls(port);
  if (urls.length > 0) {
    console.log("Open from other devices on the same network:");
    for (const url of urls) {
      console.log(`- ${url}`);
    }
  }
  console.log("Homepage: /index.html");
  console.log("Mint page: /mint.html");
});
