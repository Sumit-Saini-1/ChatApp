const socket = io();

let chatBody = document.getElementById("chatBody");
let search = document.getElementById("search");
let fUserNameId = document.getElementById("searchFriend");
let owner = "";
let fUserName = "";
let sendmsg = "";
let msg = "";


search.addEventListener("click", function (ev) {
    ev.preventDefault();
    fUserName = fUserNameId.value;
    socket.emit("searchFriend", {user:owner,fUserName:fUserName});
});

fetch("/user").then(function (response) {
    if (response.status == 200) {
        return response.json();
    }
    else {
        console.log("somthing went wrong");
    }
}).then(function (u) {
    owner = u.userName;
    socket.emit("updateSocket", owner);
}).catch(function (err) {
    console.log(err);
});

socket.on("friendName", function (friendName,chat) {
    let friendDetail = document.getElementById("friendDetail");
    if (friendName == "not found") {
        friendDetail.innerText = "Friend not found";
        chatBody.innerHTML="";
    }
    else {
        fUserNameId.value="";
        friendDetail.innerText = friendName;
        chatBody.innerHTML="";
        chatWithFriend(friendName, fUserName);
        if(chat){
            chat.forEach(m => {
                showMessage(m);
            });
        }
    }
});

function chatWithFriend(name, userName) {
    chatBody.innerHTML += `<ul id='messages'></ul>
        <form id='msgForm' action=''>
            <input id='msg' placeholder='Enter your message...' autocomplete='off' />
            <button id='sendmsg'>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
                </svg>
            </button>
        </form>`;
    sendmsg = document.getElementById("sendmsg");
    sendmsg.addEventListener('click', function (e) {
        e.preventDefault();
        msg = document.getElementById("msg");
        if (msg.value) {
            msgobj = {
                "msg": msg.value,
                "sendTo": userName,
                "sendBy": owner
            }
            socket.emit('chat message', msgobj);
            showMessage(msgobj);
            msg.value = '';
        }
    });
}


socket.on('chat message', function (msgobj) {
    if (msgobj.sendBy == fUserName) {
        showMessage(msgobj);
    }
});

function showMessage(msgobj) {
    let messages = document.getElementById("messages");
    var item = document.createElement('li');
    if(msgobj.sendBy==owner){
        item.className="sentmsg";
    }
    else{
        item.className="recievedmsg";
    }
    item.textContent = msgobj.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}