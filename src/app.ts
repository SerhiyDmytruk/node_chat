'use strict';

import { createServer } from 'node:http';

const app = createServer((_request, response) => {
  response.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
  });

  response.end(
    JSON.stringify({
      status: 'ok',
      message: 'Chat server is running',
    }),
  );
});

export default app;
