var express  = require("express");
var http     = require("http");
var socketio = require("socket.io");

var app        = express();
var httpServer = http.createServer(app);
var io         = socketio(httpServer);

app.use(express.static(__dirname + "/public"));

io.on("connection",function(socket){
    // New message received
    socket.on("newMessage",function(msg){
        //console.log("New message received :"+msg);
        // Broadcast message to all users
        io.emit("newMessage",{"msg" : msg.msg, "user":msg.user, "time" : Date.now()})
    });

    // User joined chatroom
    socket.on("newUser",function(data){
        //console.log("New user joined: "+data);
        // Broadcast message to all users
        io.emit("newUser",data)
    });    

    // User left chatroom
    socket.on("userLogout",function(user){
        //console.log(user);
        // Broadcast message to all users
        io.emit("userLogout",user)
    });

});

httpServer.listen(process.env.PORT || 3000);