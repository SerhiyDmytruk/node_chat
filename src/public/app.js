const roomsList = document.querySelector('#rooms-list');
// const messagesList = document.querySelector('#messages-list');
// const activeRoomTitle = document.querySelector('#active-room-title');

const createRoomForm = document.querySelector('#create-room-form');
const roomNameInput = document.querySelector('#room-name-input');

const state = {
  rooms: [],
  activeRoomId: null,
};

const createRoomFetch = (roomName) => {
  return fetch('/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: roomName }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    roomNameInput.value = '';

    return response.json();
  });
};

const getRoomsFetch = () => {
  return fetch('/rooms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load rooms');
    }

    return response.json();
  });
};

const getRoomByIdFetch = (roomId) => {
  return fetch(`/rooms/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to get room by Id');
    }

    return response.json();
  });
};

const deleteRoomFetch = (roomId) => {
  return fetch(`/rooms/${roomId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete rooms');
    }

    return response.json();
  });
};

createRoomForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const roomName = roomNameInput.value.trim();

  if (!roomName) {
    return;
  }

  await createRoomFetch(roomName);

  await loadRooms();

  renderRooms(state.rooms);
});

function renderRooms(data) {
  // clear before append
  [...roomsList.children].forEach((el) => {
    roomsList.removeChild(el);
  });

  // append data to DOM
  data.forEach((element) => {
    roomsList.insertAdjacentHTML(
      'beforeend',
      `
    <li class="rooms-list__item" id='${element.id}'>
      <button data-room='${element.id}'>
        ${element.name}
      </button>
      <button data-delete='${element.id}'>x</button>
    </li>
    `,
    );
  });
}

async function loadRooms() {
  const data = await getRoomsFetch();

  state.rooms = data.rooms;
}

async function init() {
  await loadRooms();

  renderRooms(state.rooms);
}

init();

roomsList.addEventListener('click', async (event) => {
  const roomId = event.target.dataset.room;
  const deleteRoom = event.target.dataset.delete;

  if (roomId) {
    getRoomByIdFetch(roomId);

    await loadRooms();

    renderRooms(state.rooms);
  }

  if (deleteRoom) {
    deleteRoomFetch(deleteRoom);

    await loadRooms();

    renderRooms(state.rooms);
  }
});
