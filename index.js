
const http = require("http");
const express = require("express");
const app = new express();

const socketIO = require("socket.io");
const cors = require("cors");

const port = process.env.PORT || 4500;


const server = http.createServer(app);
const users = [{}]


app.get("/", (req, res) => {
    res.send("this is awsome")
})
const io = socketIO(server);
io.on("connection", (socket) => {
    console.log("connection")


    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);

        // sending to front end
        // showing only new joiners in the chat
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat,${users[socket.id]}` })
    })
    socket.on('message',({message,id})=>{
      io.emit('sendmessage',{user:users[id],message,id})

    })

    socket.on('disconnected', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} user has left` })

        console.log("user left")
    })






})




server.listen(port, () => {
    console.log(`running at http://localhost:${port}`)
})

