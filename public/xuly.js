const socket = io("http://localhost:3000");
var id = "";
var usernameID = "";
socket.on("send-id", function(data) {
    id = data;
})

socket.on("server-send-dki-thatbai", function() {
    alert("Sai username");
});

socket.on("sever-send-danhsach-Users", function(data) {
    $("#boxContent").html("");
    data.forEach(function(i) {
        let splitUserId = i.split("|");
        const receivedUsername = splitUserId[0];
        const receivedId = splitUserId[1];
        if (receivedUsername != '' && receivedId != '') {
            $("#boxContent").append(`<div class="user">
        <div class="username">` + receivedUsername + `</div>
        <div class="userId">ID: ` + receivedId + `</div>
      </div>`);
        }

    });
    var myFunction = function() {


        let usernameClick = this.getElementsByClassName("username")[0].innerHTML;
        let userIdClick = this.getElementsByClassName("userId")[0].innerHTML;

        let splitUserId = userIdClick.split(": ");
        const userIdMerged = usernameClick + "|" + splitUserId[1];
        $('#txtUserToChat').val(userIdMerged)

    };
    var elements = document.getElementsByClassName("user");

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', myFunction, false);
    }
});

socket.on("server-send-dki-thanhcong", function(data) {
    usernameID = data + "|" + id;
    $("#currentUser").html(data);
    $("#LoginForm").hide(2000);
    $("#ChatForm").show(1000);
});

socket.on("server-send-rooms", function(data) {
    $("#dsRoom").html("");
    data.map(function(r) {

        $("#dsRoom").append("<div class='user'>" + r + "</div>");
    });
});

socket.on("server-send-room-socket", function(data) {
    $("#roomHienTai").html("Chat room: " + data);
});

var onClickUsername = function() {
    $('#txtUserToChat').val(this.innerHTML);
}

var updateChatClick = function() {
    var elements = document.getElementsByClassName("usernamechat");

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', onClickUsername, false);
    }
}

socket.on("server-chat", function(data) {
    var today = new Date();
    var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (data.un == usernameID) {
        $("#Group").append("<div class='ms toRight backgroundMyMsg' >"  + data.nd + "</div> <br clear='all'/>");
        $("#Group").append("<div class='msTime toRight'>" + time + "</div> <br clear='all'/>");
    } else {
        $("#Group").append("<div class='ms toLeft backgroundTheirMsg'>" + "<div class='usernamechat'>" + data.un + "</div>" + ": " + data.nd + "</div> <br clear='all'/>");
        $("#Group").append("<div class='msTime toLeft'>" + time + "</div> <br clear='all'/>");
    }

    updateChatClick();
});

socket.on("server-send-message", function(data) {
    var today = new Date();
    var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (data.un == usernameID) {
        $("#ListMessages").append("<div class='ms toRight backgroundMyMsg'>" + data.nd + "</div> <br clear='all'/>");
        $("#ListMessages").append("<div class='msTime toRight'>" + time + "</div> <br clear='all'/>");
    } else {
        $("#ListMessages").append("<div class='ms toLeft backgroundTheirMsg'>" + "<div class='usernamechat'>" + data.un + "</div>" + ": " + data.nd + "</div> <br clear='all'/>");
        $("#ListMessages").append("<div class='msTime toLeft'>" + time + "</div> <br clear='all'/>");
    }

    updateChatClick();
});



socket.on("connect-private-success", function(data) {
    alert("Kết nối thành công");
    $("#userHientai").html("Đang chat với " + data);
})

socket.on("connect-private-failed", function() {
    alert("Kết nối thất bại");
})

socket.on("send-private-msg-failed", function() {
    alert("Username hoặc ID không hợp lệ!")
})

socket.on("receive-private-msg", function(data) {
    let sender = data.sender;
    var today = new Date();
    var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    $("#userChat").append("<div class='ms toLeft backgroundTheirMsg'>" + "From " + "<div class='usernamechat'>" + sender + "</div>" + ": " + data.msg + "</div> <br clear='all'/>");
    $("#userChat").append("<div class='msTime toLeft'>" + time + "</div> <br clear='all'/>");
    updateChatClick();
})
$(document).ready(function() {
    $("#LoginForm").show();
    $("#ChatForm").hide();

    $("#btnRegister").click(function() {
        let username = $("#txtUsername").val();
        if (username != "") {
            socket.emit("client-send-Username", { username: username, id: id });
        } else {
            alert("Username cannot be empty");
        }

    });

    $("#btnTaoRoom").click(function() {
        let room = $("#txtRoom").val();

        if (room.length > 10) {
            alert("Room name up to 10 characters");
            $("#txtRoom").val("");
        } else if (room != "") {
            socket.emit("tao-room", {
                room: room
            });
            $("#txtRoom").val("");

        } else {
            alert("Tên hoặc mật khẩu không đúng");
        }
        $("#btnTaoRoom").addClass("display-none");
        $("#btnLeave").removeClass("display-none");
    });
    const sendMsgGeneral = () => {
        let msg = $("#txtMessage").val();
        if (msg != "") {
            socket.emit("user-send-message", { msg: msg, sender: usernameID });
            $("#txtMessage").val("");
        }
    }
    $("#btnSendMessage").click(function() {
        sendMsgGeneral();
    });
    $("#txtMessage").keypress(function(event) {
        if (event.which == 13) {
            sendMsgGeneral();
        }
    });
    const sendMsgRoom = () => {
        let msg = $("#txtMessageRoom").val();
        if (msg != "") {
            socket.emit("user-chat", { msg: msg, sender: usernameID });
            $("#txtMessageRoom").val("")
        }

    }
    $("#btnSendMessageRoom").click(function() {
        sendMsgRoom();
    });
    $("#txtMessageRoom").keypress(function(event) {
        if (event.which == 13) {
            sendMsgRoom();
        }
    });
    $("#btnLogout").click(function() {
        socket.emit("logout");
        $("#ChatForm").hide(2);
        $("#LoginForm").show(1);
        $("#ListMessages").empty();
        $("#Group").empty();
    });


    $("#btnLeave").click(function() {
        let roomHtml = $("#roomHienTai").html();
        roomHtml = roomHtml.split(": ");
        roomToSend = roomHtml[1];

        socket.emit("user-leave", roomToSend);
        $("#roomHienTai").html("Chat room: None");
        $("#Group").empty();
        $("#btnTaoRoom").removeClass("display-none");
        $("#btnLeave").removeClass("display-none");
    });
    const sendMsgUser = () => {
        let user = $("#txtUserToChat").val();
        let msg = $("#txtMessageUser").val();
        if (user != "" && msg != "") {
            var today = new Date();
            var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            $("#userChat").append("<div class='ms toRight backgroundMyMsg'>" + "To " + "<div class='usernamechat'>" + user + "</div>" + ": " + msg + "</div> <br clear='all'/>");
            $("#userChat").append("<div class='msTime toRight'>" + time + "</div> <br clear='all'/>");
            socket.emit("send-private-msg", { user: user, msg: msg, sender: usernameID });

            $("#txtMessageUser").val("");
        }
    }
    $("#btnSendMessageUser").click(function() {
        sendMsgUser();
    });
    $('#btnClearMessageUser').click(function() {
        $("#userChat").html("");
    });
    $("#txtMessageUser").keypress(function(event) {
        if (event.which == 13) {
            sendMsgUser();
        }
    });

});
