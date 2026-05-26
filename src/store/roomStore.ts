type Message = {
  authour: string;
  time: string;
  text: string[];
};

type RoomInterface = {
  id: string;
  name: string;
  messages: Message[];
};

let rooms: RoomInterface[] = [];

const generalRoom: RoomInterface = {
  id: '1',
  name: 'General',
  messages: [
    {
      authour: 'Serg',
      time: Date(),
      text: ['Test'],
    },
  ],
};

rooms.push(generalRoom);

const getAllRoom = () => {
  return rooms;
};

const getRoomById = (roomId: string) => {
  return rooms.find((room) => room.id === roomId);
};

const createRoom = (
  roomName: string,
  roomAuthour: string,
  roomText: string,
) => {
  const newRoom: RoomInterface = {
    id: new Date().toISOString(),
    name: roomName,
    messages: [
      {
        authour: roomAuthour,
        time: new Date().toISOString(),
        text: [roomText],
      },
    ],
  };

  rooms.push(newRoom);
};

const addMessageToRoom = (
  roomId: string,
  roomAuthour: string,
  roomText: string,
) => {
  const room = getRoomById(roomId);
  const nowDate = new Date().toISOString();

  if (!room) {
    return false;
  }

  room.messages.push({
    authour: roomAuthour,
    time: nowDate,
    text: [roomText],
  });
};

const updateRoom = (roomId: string, newRoomName: string) => {
  const room = getRoomById(roomId);

  if (!room) {
    return false;
  }
  room.name = newRoomName;

  return room;
};

const deleteRoom = (roomId: string) => {
  rooms = rooms.filter((room) => room.id !== roomId);

  return rooms;
};

export const roomStore = {
  getAllRoom,
  createRoom,
  addMessageToRoom,
  updateRoom,
  deleteRoom,
};
