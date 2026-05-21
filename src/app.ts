// @ts-nocheck
'use strict';

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const PUBLIC_DIR = path.join(__dirname, 'public');
const DEFAULT_FILE = 'index.html';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function setCorsHeaders(request, response) {
  const allowedOrigin = process.env.FE_URL;
  const requestOrigin = request.headers.origin;

  if (allowedOrigin && requestOrigin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Vary', 'Origin');
  }
}

function sendJson(request, response, statusCode, payload) {
  setCorsHeaders(request, response);

  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function sendNoContent(request, response) {
  setCorsHeaders(request, response);

  response.writeHead(204, {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Content-Length': '0',
  });
  response.end();
}

function resolvePublicPath(urlPathname) {
  const normalizedPath = urlPathname === '/' ? `/${DEFAULT_FILE}` : urlPathname;
  const safeRelativePath = path
    .normalize(normalizedPath)
    .replace(/^(\.\.[/\\])+/, '');

  return path.join(PUBLIC_DIR, safeRelativePath);
}

async function serveStaticFile(request, response, pathname) {
  const filePath = resolvePublicPath(pathname);
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    sendJson(request, response, 403, { error: 'Forbidden' });

    return true;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return false;
    }

    const extension = path.extname(filePath);
    const contentType = CONTENT_TYPES[extension] || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': contentType,
    });

    createReadStream(filePath).pipe(response);

    return true;
  } catch {
    return false;
  }
}

async function requestListener(request, response) {
  const method = request.method || 'GET';
  const url = new URL(request.url || '/', 'http://localhost');
  const { pathname } = url;

  if (method === 'OPTIONS') {
    sendNoContent(request, response);

    return;
  }

  if (method === 'GET' && pathname === '/health') {
    sendJson(request, response, 200, {
      message: 'Chat server is running',
      status: 'ok',
    });

    return;
  }

  if (method === 'GET') {
    const fileServed = await serveStaticFile(request, response, pathname);

    if (fileServed) {
      return;
    }
  }

  sendJson(request, response, 404, { error: 'Not found' });
}

const app = createServer((request, response) => {
  void requestListener(request, response);
});

export default app;
