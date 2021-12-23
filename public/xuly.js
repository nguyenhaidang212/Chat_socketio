var socket = io("https://chat-129144.herokuapp.com");
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
    let splitUserId = i.split("|");
    const receivedUsername = splitUserId[0];
    const receivedId = splitUserId[1];
    if(receivedUsername!='' && receivedId!=''){
      $("#boxContent").append(`<div class="user">
        <div class="username">`+receivedUsername+`</div>
        <div class="userId">ID: `+receivedId+`</div>
      </div>`);
    }

  });
  var myFunction =  function() {


        let usernameClick = this.getElementsByClassName("username")[0].innerHTML;
        let userIdClick = this.getElementsByClassName("userId")[0].innerHTML;

        let splitUserId = userIdClick.split(": ");
        const userIdMerged = usernameClick + "|"+splitUserId[1];
        $('#txtUserToChat').val(userIdMerged)

};
  var elements = document.getElementsByClassName("user");

  for(let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', myFunction, false);
    }
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
  $("#roomHienTai").html("Chat room: " + data);
});

var onClickUsername = function(){
  $('#txtUserToChat').val(this.innerHTML);
}

var updateChatClick = function(){
  var elements = document.getElementsByClassName("usernamechat");

  for(let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', onClickUsername, false);
    }
}

socket.on("server-chat", function(data){
  $("#Group").append("<div class='ms'>" + "<div class='usernamechat'>"+data.un+"</div>" + ": " + data.nd + "</div>");
  updateChatClick();
});

socket.on("server-send-message", function(data){
  $("#ListMessages").append("<div class='ms'>" + "<div class='usernamechat'>"+data.un+"</div>" + ": " + data.nd + "</div>");
  updateChatClick();
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
  let sender=data.sender;
  $("#userChat").append("<div class='ms'>"+"From "+ "<div class='usernamechat'>"+sender+"</div>" +  ": " + data.msg + "</div>");

  updateChatClick();
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
      alert("Username cannot be empty");
    }

  });

  $("#btnTaoRoom").click(function(){
    let room=$("#txtRoom").val();

    if(room.length >10){
      alert("Room name up to 10 characters");
      $("#txtRoom").val("");
    }
    else if(room!=""){
      socket.emit("tao-room", {
        room:room
      });
      $("#txtRoom").val("");

    }else{
      alert("Tên hoặc mật khẩu không đúng");
    }
    $("#btnTaoRoom").addClass("display-none");
    $("#btnLeave").removeClass("display-none");
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
    let roomHtml =  $("#roomHienTai").html();
    roomHtml = roomHtml.split(": ");
    roomToSend = roomHtml[1];

    socket.emit("user-leave",roomToSend);
    $("#roomHienTai").html("Chat room: None");
    $("#Group").empty();
    $("#btnTaoRoom").removeClass("display-none");
    $("#btnLeave").addClass("display-none");
  });

  $("#btnSendMessageUser").click(function(){
    let user = $("#txtUserToChat").val();
    let msg = $("#txtMessageUser").val();
    if(user != "" && msg!=""){
      $("#userChat").append("<div class='ms'>" + "To "+  "<div class='usernamechat'>"+user+"</div>" +  ": " + msg + "</div>");
      socket.emit("send-private-msg", {user: user, msg:msg, sender: usernameID});

      $("#txtMessageUser").val("");
    }
  })

});
