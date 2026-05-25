const rooms = [];
const generalRoom = {
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

roomStore.push(generalRoom);

const getAllRoom = () => {
  return rooms;
};

const getRoomById = (roomId) => {
  return rooms.find((room) => room.id === roomId);
};

const createRoom = ({ roomName, roomAuthour }) => {
  const newRoom = {
    id: new Temporal.Now.instant().epochMilliseconds,
    name: roomName,
    messages: [
      {
        authour: roomAuthour,
        time: new Temporal.PlainDateTime.prototype.add(),
        text: [],
      },
    ],
  };

  rooms.push(newRoom);
};

const addMessageToRoom = ({ roomId, roomAuthour, roomText }) => {
  const room = getRoomById(roomId);
  const nowTemporal = new Temporal.PlainDateTime.prototype.add();

  room.messages.push({
    authour: roomAuthour,
    time: nowTemporal,
    text: roomText,
  });
};

const updateRoom = (roomId, newRoomName) => {
  const room = getRoomById(roomId);

  room.name = newRoomName;

  return room;
};

const deleteRoom = (roomId) => {
  return rooms.filter((room) => room.id !== roomId);
};

export const roomStore = {
  getAllRoom,
  createRoom,
  addMessageToRoom,
  updateRoom,
  deleteRoom,
};
