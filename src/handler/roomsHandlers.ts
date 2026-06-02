import { IncomingMessage, ServerResponse } from 'node:http';

import { roomStore } from '../store/roomStore.js';
import { readJsonBody } from '../utils/readJsonBody.js';
import { sendJson } from '../utils/utils.js';

type RoomPayload = {
  name?: unknown;
};

function parseRoomName(payload: RoomPayload | null) {
  if (!payload || typeof payload.name !== 'string') {
    return null;
  }

  const roomName = payload.name.trim();

  if (!roomName) {
    return null;
  }

  return roomName;
}

function sendInvalidBody(
  request: IncomingMessage,
  response: ServerResponse,
  message = 'Room name is required',
) {
  sendJson(request, response, 400, { error: message });
}

export function getRoomsHandler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  sendJson(request, response, 200, {
    rooms: roomStore.getAllRooms(),
  });
}

export function getRoomByIdHandler(
  request: IncomingMessage,
  response: ServerResponse,
  roomId: string,
) {
  const room = roomStore.getRoomById(roomId);

  if (!room) {
    sendJson(request, response, 404, { error: 'Room not found' });

    return;
  }

  sendJson(request, response, 200, { room });
}

export async function createRoomHandler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  try {
    const payload = await readJsonBody<RoomPayload>(request);
    const roomName = parseRoomName(payload);

    if (!roomName) {
      sendInvalidBody(request, response);

      return;
    }

    if (roomStore.hasRoomWithName(roomName)) {
      sendJson(request, response, 409, {
        error: 'Room with this name already exists',
      });

      return;
    }

    const room = roomStore.createRoom(roomName);

    sendJson(request, response, 201, { room });
  } catch {
    sendInvalidBody(request, response, 'Invalid JSON body');
  }
}

export async function updateRoomHandler(
  request: IncomingMessage,
  response: ServerResponse,
  roomId: string,
) {
  const currentRoom = roomStore.getRoomById(roomId);

  if (!currentRoom) {
    sendJson(request, response, 404, { error: 'Room not found' });

    return;
  }

  try {
    const payload = await readJsonBody<RoomPayload>(request);
    const roomName = parseRoomName(payload);

    if (!roomName) {
      sendInvalidBody(request, response);

      return;
    }

    if (roomStore.hasRoomWithName(roomName, roomId)) {
      sendJson(request, response, 409, {
        error: 'Room with this name already exists',
      });

      return;
    }

    const room = roomStore.updateRoom(roomId, roomName);

    sendJson(request, response, 200, { room });
  } catch {
    sendInvalidBody(request, response, 'Invalid JSON body');
  }
}

export function deleteRoomHandler(
  request: IncomingMessage,
  response: ServerResponse,
  roomId: string,
) {
  if (roomId === roomStore.GENERAL_ROOM_ID) {
    sendJson(request, response, 400, {
      error: 'General room cannot be deleted',
    });

    return;
  }

  const deletedRoom = roomStore.deleteRoom(roomId);

  if (!deletedRoom) {
    sendJson(request, response, 404, { error: 'Room not found' });

    return;
  }

  sendJson(request, response, 200, {
    deletedRoom,
    fallbackRoomId: roomStore.GENERAL_ROOM_ID,
  });
}
