import { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from './utils/utils.js';

type RouteHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

type RoutesMap = Record<string, RouteHandler>;

export const router = (
  method: string,
  pathname: string,
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const objectRouter: RoutesMap = {
    'GET /health': (
      objRequest: IncomingMessage,
      objResponse: ServerResponse,
    ) => {
      sendJson(objRequest, objResponse, 200, {
        message: 'Chat server is running',
        status: 'ok',
      });
    },
    'GET /auth': () => {
      // TODO
    },
    'GET /rooms': () => {
      // TODO
    },
    'POST /rooms': () => {
      // TODO
    },
  };

  const routeKey = `${method} ${pathname}`;
  const handler = objectRouter[routeKey];

  if (!handler) {
    return false;
  }

  handler(request, response);

  return true;
};
