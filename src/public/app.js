const roomsList = document.querySelector('#rooms-list');
const messagesList = document.querySelector('#messages-list');
const activeRoomTitle = document.querySelector('#active-room-title');

const createRoomForm = document.querySelector('#create-room-form');
const roomNameInput = document.querySelector('#room-name-input');
const messageForm = document.querySelector('#message-form');
const messageFormRoomName = document.querySelector(
  '#message-form input[name="room"]',
);

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

const messageToRoomFetch = (roomId, author, text) => {
  return fetch(`/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author, text }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to add message to room');
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

messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const author = formData.get('author');
  const text = formData.get('text');

  if (
    state.activeRoomId !== null &&
    typeof author === 'string' &&
    typeof text === 'string' &&
    author.trim() !== '' &&
    text.trim() !== ''
  ) {
    await messageToRoomFetch(state.activeRoomId, author.trim(), text.trim());

    const roomData = await getRoomByIdFetch(state.activeRoomId);

    renderMessage(roomData.room.messages);
    event.currentTarget.reset();
    messageFormRoomName.value = activeRoomTitle.innerText;
  }
});

function renderMessage(data) {
  // clear before append
  [...messagesList.children].forEach((el) => {
    messagesList.removeChild(el);
  });

  if (data.length) {
    data.forEach((element) => {
      messagesList.insertAdjacentHTML(
        'beforeend',
        `
        <li class="messagesList-list__item">
          ${element.author} - ${element.time} - ${element.text}
        </li>
        `,
      );
    });
  }
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
    const roomMessage = await getRoomByIdFetch(roomId);
    const roomName = roomMessage.room.name;

    state.activeRoomId = roomId;

    activeRoomTitle.innerText = roomName;
    messageFormRoomName.value = roomName;

    renderMessage(roomMessage.room.messages);
  }

  if (deleteRoom) {
    const deleteFallbackRoomId = await deleteRoomFetch(deleteRoom);

    state.activeRoomId = deleteFallbackRoomId.fallbackRoomId;

    await loadRooms();
    renderRooms(state.rooms);

    const fallbackRoom = await getRoomByIdFetch(
      deleteFallbackRoomId.fallbackRoomId,
    );

    activeRoomTitle.innerText = fallbackRoom.room.name;
    messageFormRoomName.value = fallbackRoom.room.name;
    renderMessage(fallbackRoom.room.messages);
  }
});
