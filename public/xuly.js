var socket = io("http://localhost:3000");
var id ="";
var usernameID ="";
socket.on("send-id", function(data){
  id = data;
})

socket.on("server-send-dki-thatbai", function(){
  alert("Sai username");
});

socket.on("sever-send-danhsach-Users", function(data){
  $("#boxContent").html("");
  data.forEach(function(i){
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});

socket.on("server-send-dki-thanhcong", function(data){
  usernameID = data+"|"+id;
  $("#currentUser").html(data);
  $("#LoginForm").hide(2000);
  $("#ChatForm").show(1000);
});

socket.on("server-send-rooms", function(data){
  $("#dsRoom").html("");
  data.map(function(r){

    $("#dsRoom").append("<div class='user'>" + r + "</div>");
  });
});

socket.on("server-send-room-socket", function(data){
  $("#roomHienTai").html("Đang trong phòng: " + data);
});

socket.on("server-chat", function(data){
  $("#Group").append("<div class='ms'>" + data.un + ": " + data.nd + "</div>");
});

socket.on("server-send-message", function(data){
  $("#ListMessages").append("<div class='ms'>" + data.un + ": " + data.nd + "</div>");
});

socket.on("stoptyping", function(data) {
    $("#typingNotify").html("");
})

socket.on("typing", function(data) {
    $("#typingNotify").html("<img width='20px' src='typing.gif'>" + data);
});

socket.on("stoptypingroom", function(data) {
    $("#typingNotifyroom").html("");
})

socket.on("typingroom", function(data) {
    $("#typingNotifyroom").html("<img width='20px' src='typing.gif'>" + data);
});

socket.on("connect-private-success", function(data){
  alert("Kết nối thành công");
  $("#userHientai").html("Đang chat với " + data);
})

socket.on("connect-private-failed", function(){
  alert("Kết nối thất bại");
})

socket.on("send-private-msg-failed", function(){
  alert("Username hoặc ID không hợp lệ!")
})

socket.on("receive-private-msg", function(data){
  $("#userChat").append("<div class='ms'>"+"From " + data.sender +  ": " + data.msg + "</div>");
})
$(document).ready(function(){
  $("#LoginForm").show();
  $("#ChatForm").hide();

  $("#txtMessage").focusin(function() {
    socket.emit("usertyping");
});

$("#txtMessage").focusout(function() {
    socket.emit("userstoptyping");
});

//$("#txtMessageRoom").focusin(function() {
//  socket.emit("usertypingroom");
//});

//$("#txtMessageRoom").focusout(function() {
//  socket.emit("userstoptypingroom");
//});

  $("#btnRegister").click(function(){
    let username = $("#txtUsername").val();
    if (username!= ""){
      socket.emit("client-send-Username", {username: username, id: id});
    }
    else {
      alert("Username không được để trống");
    }

  });

  $("#btnTaoRoom").click(function(){
    let room=$("#txtRoom").val();

    if(room.length >10){
      alert("Tên phòng tối đa 10 ký tự");
      $("#txtRoom").val("");
    }
    else if(room!=""){
      socket.emit("tao-room", {
        room:room
      });
      $("#txtRoom").val("");
      alert("Tạo phòng thành công");
    }else{
      alert("Tên hoặc mật khẩu không đúng");
    }
});

$("#btnSendMessage").click(function(){
  let msg = $("#txtMessage").val();
  if (msg != ""){
    socket.emit("user-send-message", {msg: msg, sender : usernameID});
    $("#txtMessage").val("");
  }
});

$("#btnSendMessageRoom").click(function(){
  let msg = $("#txtMessageRoom").val();
  if(msg != ""){
    socket.emit("user-chat", {msg: msg, sender : usernameID});
    $("#txtMessageRoom").val("")
  }

});

  $("#btnLogout").click(function(){
    socket.emit("logout");
    $("#ChatForm").hide(2);
    $("#LoginForm").show(1);
    $("#ListMessages").empty();
    $("#Group").empty();
  });


  $("#btnLeave").click(function(){
    socket.emit("user-leave", $("#roomHienTai").html());
    $("#roomHienTai").html("Không trong phòng nào ");
    $("#Group").empty();
  });

  $("#btnSendMessageUser").click(function(){
    let user = $("#txtUserToChat").val();
    let msg = $("#txtMessageUser").val();
    if(user != "" && msg!=""){
      $("#userChat").append("<div class='ms'>" + "To "+ user +  ": " + msg + "</div>");
      socket.emit("send-private-msg", {user: user, msg:msg, sender: usernameID});
      $("#txtUserToChat").val("");
      $("#txtMessageUser").val("");
    }
  })
});
