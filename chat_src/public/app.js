const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const joinForm = document.getElementById("join");
const nameForm = document.getElementById("name");
const msgForm = document.getElementById("msg");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`나: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nameForm.querySelector("input");
  socket.emit("nickname", input.value);
  const p = nameForm.querySelector("p");
  p.innerText = "저장되었습니다.";
}

function showRoom(roomCount) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} (${roomCount}명)`;
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = joinForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

nameForm.addEventListener("submit", handleNicknameSubmit);
joinForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} (${newCount}명)`;
  addMessage(`'${user}'님이 입장했습니다.`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} (${newCount}명)`;
  addMessage(`'${left}'님이 퇴장했습니다.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = `${room.name} (${room.size}명)`;
    roomList.append(li);
  });
});
