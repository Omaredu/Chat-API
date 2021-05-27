const mongoose = require('mongoose')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')

const app = express()

app.use(require('cors')())

// begin: mongoose settings
mongoose.connect("mongodb://127.0.0.1:27017/hyperchat", { useNewUrlParser: true, useUnifiedTopology: true })

const MessagesSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, { timestamps: true })
// begin: end settings

const Message = mongoose.model("Message", MessagesSchema)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const server = app.listen(3030, () => console.log("Server running on port: 3030"))

const io = socketio(server, { cors:{ 
    origin: "*"
} })

io.on('connection', socket => {
    //console.log(socket.id)

    socket.on('submit', async ({ body, user }) => {
        const message = await Message.create({ body: body || "", user: user || "" })
        
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        //console.log('user disconnected')
    })
})

app.get('/messages', async (req, res) => {
    res.json(await Message.find())
})

app.get("/", async (req, res) => {
    const messages = await Message.find()
    res.render('index', { messages })
})