'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const app = (0, node_http_1.createServer)((_request, response) => {
    response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify({
        status: 'ok',
        message: 'Chat server is running',
    }));
});
exports.default = app;
