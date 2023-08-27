const socket = io();
const messageInput = document.getElementById('messageInput'),
  chatForm = document.getElementById('chatForm'),
  chatBox = document.getElementById('chat-box'),
  feedback = document.getElementById('feedback'),
  onlineUsers = document.getElementById('online-users-list'),
  chatContainer = document.getElementById('chatContainer'),
  d = new Date();

window.onload = function () {
  document.onkeydown = function (e) {
    return (e.which || e.keyCode) != 116;
  };
};

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit('chat message', {
      message: messageInput.value,
      name: nickname,
      time: `${d.getHours() + 1}:${d.getMinutes()}`,
    });
    messageInput.value = '';
  }
});

const nickname = localStorage.getItem('nickname');

socket.emit('login', nickname);

messageInput.addEventListener('keypress', () => {
  socket.emit('typing status', {
    name: nickname,
  });
});

socket.on('chat message', (data) => {
  feedback.innerHTML = '';
  chatBox.innerHTML += `<li class="alert alert-light">
              <span class="text-dark font-weight-normal" style="font-size: 13pt;">${data.name}</span>
              <span class="text-muted font-italic font-weight-light m2" style="font-size: 9pt;">${data.time}</span>
              <p class="alert alert-info mt-2" style="font-family: persian01;">${data.message}</p>
            </li>`;
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.clientHeight;
});

socket.on('typing status', (data) => {
  console.log(data);
  feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است</em></p>`;
});

socket.emit('onlineUsers', nickname);
socket.on('onlineMembers', (data) => {
  onlineUsers.innerHTML = Object.values(data)
    .map((person) => {
      return `<li class="alert alert-light p-1 mx-2">
                ${person}
                <span class="badge badge-success">آنلاین</span>
            </li>`;
    })
    .join(' ');
});
