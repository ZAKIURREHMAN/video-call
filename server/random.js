const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv/config");

const app = express();
const PORT = process.env.PORT;
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true,
  },
});

const nameToSocketId = new Map();
const socketIdToName = new Map();

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join-room", ({ name, room }) => {
    socket.join(room)
    nameToSocketId.set(name, socket.id);
    socketIdToName.set(socket.id, name);
    io.to(room).emit('user-joined',{name,room})
    io.to(socket.id).emit("join-room", {name, room});
  });

  socket.on('call-user',({to,offer})=>{
    io.to(to).emit('call-come',({from:socket.id,offer}))
  })

  socket.on("call-accepted",({to,ans})=>{
    io.to(to).emit("call-accepted",{from:socket.id,ans})
  })

});

server.listen(PORT, () => {
  console.log(` Server is running in this port ${PORT} `);
});
