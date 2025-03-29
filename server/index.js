const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')
require('dotenv').config()
const PORT = process.env.PORT

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GEP','POST'],
        credentials:true
    }
})
const emailToSocketId = new Map()
const socketIdToEmail = new Map()


io.on('connection',(socket)=>{
    socket.on('join-room',({email,room})=>{
        emailToSocketId.set(email,socket.id)
        socketIdToEmail.set(socket.id,email)
        io.to(room).emit('user-joined',{email,id:socket.id})
        socket.join(room)
        io.to(socket.id).emit('save-room',{email,room})
    })


    socket.on('user-call',({to,offer})=>{
        io.to(to).emit('income-call',{from:socket.id,offer})
    })

    socket.on('call-accept',({to,ans})=>{
        io.to(to).emit('call-accepted',{from:socket.id,ans})
    })

    socket.on('peer-negotiation-need',({to,offer})=>{
        io.to(to).emit('peer-negotiation-need',{from:socket.id,offer})
    })

    socket.on('peer-negotiation-done',({to,ans})=>{
        io.to(to).emit('peer-negotiation-final',{from:socket.id,ans})

    })
})
server.listen(PORT,()=>{
    console.log(`Server is Running in this PORT ${PORT}`)
})
