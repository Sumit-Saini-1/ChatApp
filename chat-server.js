const express = require('express');
const app = express();
const http = require('http');
const socketServer = http.createServer(app);
const { Server } = require("socket.io");
const chatServer = new Server(socketServer);
const database=require("./userdatabase");
const msgdatabase=require("./msgdatabase");

let user="";

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get("/index.js",function(req,res){
    res.sendFile(__dirname+"/index.js");
});
app.get("/index.css",function(req,res){
    res.sendFile(__dirname+"/index.css");
});


app.get("/chat",function(req,res){
    res.sendFile(__dirname+"/chat.html");
});
app.get("/chat.js",function(req,res){
    res.sendFile(__dirname+"/chat.js");
});
app.get("/chat.css",function(req,res){
    res.sendFile(__dirname+"/chat.css");
});


app.get("/user",function(req,res){
    res.status(200).json({userName:user});
})



chatServer.on('connection', function (socket) {
    console.log('a user connected');

    socket.on("registerUser", function (userDetail) {
        if(!database.getUser(userDetail.userName)){
            database.registerUser(userDetail,socket.id);
            user=userDetail.userName;
            socket.emit("registerResult",true);
        }
        else{
            socket.emit("registerResult",false);
        }
    });

    socket.on("loginDetails", function (userDetail) {
        let storedUser=database.getUser(userDetail.userName);
        if(storedUser){
            if(userDetail.password==storedUser.password){
                database.updateSocket(userDetail.userName,socket.id);
                user=userDetail.userName;
                socket.emit("loginResult",true);
            }
            else{
                socket.emit("loginResult",false);
            }
        }
        else{
            socket.emit("loginResult",false);
        }
    });

    socket.on("updateSocket",function(userName){
        database.updateSocket(userName,socket.id);
    });

    socket.on("searchFriend",function(data){
        fUserName=data.fUserName;
        let friend=database.getUser(fUserName);
        if(friend){
            let chat=msgdatabase.getData(data.user,fUserName);
            socket.emit("friendName",friend.name,chat);
        }
        else{
            socket.emit("friendName","not found",null);
        }
    });

    socket.on('chat message', function (msgobj) {
        let sendTo=database.getUser(msgobj.sendTo);
        if(sendTo){
            msgdatabase.storeMsg(msgobj);
        }
        chatServer.to(sendTo.connection).emit("chat message",msgobj);
    });
    
    socket.on("disconnect", function () {
        console.log("a user disconnected");
    });
});


socketServer.listen(2000, function () {
    console.log('listening on 2000');
});