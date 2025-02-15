const express = require('express')
const cors = require('cors')
const {createServer} = require('http')
const {Server} = require('socket.io')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

const server = createServer(app)
const io = new Server(server,{
  cors:{
    origin:'*',
    methods:['GET','POST'],
    credentials:true
  }
})

io.on('connection',(socket)=>{
  console.log(socket.id)
  socket.on('join-room',(data)=>{
    
  })
})


server.listen(PORT,()=>{
  console.log(`Server is connect in this PORT ${PORT} `)
})