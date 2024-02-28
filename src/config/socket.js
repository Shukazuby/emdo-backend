// socketServer.js
const { Server } = require("socket.io");
const {sendMessage}  = require("../services/message.service");
const {sendNotification}  = require("../services/notification.service");

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
        console.log(content) 
        console.log(senderId) 
        console.log(receiverId) 

       await sendMessage(senderId, receiverId, content)
       
      io.to(user.socketId).emit("getMessage", {
        senderId,
        content,
      });
    });

    socket.on("notification", async ({ senderId, receiverId }) => {
        console.log(senderId) 
        console.log(receiverId) 

       await sendNotification(senderId, receiverId)
       
      io.to(user.socketId).emit("getNotification", {
        senderId,
      });
    });

    //when disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected!`);
    });
  });


};

module.exports = socketServer;
