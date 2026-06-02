import { IncomingMessage, ServerResponse } from 'node:http';
import {
  createRoomHandler,
  deleteRoomHandler,
  getRoomByIdHandler,
  getRoomsHandler,
  updateRoomHandler,
} from './handler/roomsHandlers.js';
import { sendJson } from './utils/utils.js';

const ROOM_ID_PATHNAME_REGEXP = /^\/rooms\/([^/]+)$/;

export const router = async (
  method: string,
  pathname: string,
  request: IncomingMessage,
  response: ServerResponse,
) => {
  if (method === 'GET' && pathname === '/health') {
    sendJson(request, response, 200, {
      message: 'Chat server is running',
      status: 'ok',
    });

    return true;
  }

  if (method === 'GET' && pathname === '/rooms') {
    getRoomsHandler(request, response);

    return true;
  }

  if (method === 'POST' && pathname === '/rooms') {
    await createRoomHandler(request, response);

    return true;
  }

  const roomMatch = pathname.match(ROOM_ID_PATHNAME_REGEXP);

  if (!roomMatch) {
    return false;
  }

  const roomId = decodeURIComponent(roomMatch[1]);

  if (method === 'GET') {
    getRoomByIdHandler(request, response, roomId);

    return true;
  }

  if (method === 'PATCH') {
    await updateRoomHandler(request, response, roomId);

    return true;
  }

  if (method === 'DELETE') {
    deleteRoomHandler(request, response, roomId);

    return true;
  }

  return false;
};
