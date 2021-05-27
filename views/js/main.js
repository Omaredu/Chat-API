const socket = io()

const chat = document.querySelector('#chat')
var chatBox = document.querySelector('#chatbox')
var userBox = document.querySelector('#userbox')

socket.on('connect', () => console.log(socket.id))
socket.on('disconnect', () => socket.connect())

const sendMessage = () => {
    socket.emit('submit', { body: chatBox.value, user: userBox.value })
}

socket.on('message', (msg) => {
    chat.innerHTML += `<li><div><p>${msg.user}</p><p>${msg.createdAt}</p><p>${msg.body}</p></div></li>`
})