var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUsers=[""];

io.on("connection", function(socket){
  console.log("Co nguoi ket noi " + socket.id)
  socket.emit("send-id", socket.id)
  socket.on("client-send-Username", function(data){
    const username = data.username;
    const id = data.id;
    const userId = username + "|"+id;
    if(mangUsers.indexOf(username)>=0){
      socket.emit("server-send-dki-thatbai");
    }else{

      mangUsers.push(userId);


      socket.Username = username;
      socket.emit("server-send-dki-thanhcong", username);
      io.sockets.emit("sever-send-danhsach-Users", mangUsers);
    };

  });
  var matkhau= new Map();
  socket.on("send-private-msg", function(data){
    let userId = data.user;
    let msg = data.msg;
    console.log(userId);
    let splitUserId = userId.split("|");
    const username = splitUserId[0];
    const id = splitUserId[1];
    if(mangUsers.indexOf(userId) <0){
      socket.emit("send-private-msg-failed");
    }else{
      io.to(id).emit("receive-private-msg", data);
    }
  })
  socket.on("tao-room", function(data){


      let room=data.room;

      socket.join(data.room);
      socket.Phong=data.room;


    var mang=[];
  for(const r of socket.adapter.rooms){
    if(r[0].length <= 10){
      mang.push(r[0]);
    }

  }
  io.sockets.emit("server-send-rooms", mang);
  socket.emit("server-send-room-socket", data.room);

});

  socket.on("user-chat", function(data){
    io.sockets.in(socket.Phong).emit("server-chat", {un:data.sender, nd:data.msg});
});

  socket.on("user-send-message", function(data){
    io.sockets.emit("server-send-message", {un:data.sender, nd:data.msg} );


  });

  socket.on("usertyping", function() {
    socket.broadcast.emit("typing", "Someone is typing...");
});
socket.on("userstoptyping", function() {
    socket.broadcast.emit("stoptyping");
});

//socket.on("usertypingroom", function() {
//  socket.broadcast.emit("typingroom", "Someone is typing...");
//});
//socket.on("userstoptypingroom", function() {
//  socket.broadcast.emit("stoptypingroom");
//});

  socket.on("user-leave", function(data){
  socket.leave(data);
});

socket.on("logout", function(){
  mangUsers.splice(
    mangUsers.indexOf(socket.Username), 1
  );
  socket.broadcast.emit("sever-send-danhsach-Users", mangUsers);
});

});

app.get("/", function(req, res){
  res.render("trangchu");
});
