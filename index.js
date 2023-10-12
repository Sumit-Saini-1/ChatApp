const socket = io();

let userNameId = document.getElementById("userName");
let passwordId = document.getElementById("password");
let login = document.getElementById("login");
let loginResultLabel=document.getElementById("loginResultLabel");

let rUserNameId = document.getElementById("rUserName");
let rPasswordId = document.getElementById("rPassword");
let rNameId = document.getElementById("rName");
let register = document.getElementById("register");
let registerationResultLabel = document.getElementById("registerationResultLabel");

login.addEventListener("click", function (ev) {
    let userName = userNameId.value;
    if(!userName){
        alert("Enter username");
        return;
    }
    let password = passwordId.value;
    if(!password){
        alert("Enter password");
        return;
    }
    let userDetail = {
        "userName": userName,
        "password": password
    };
    socket.emit("loginDetails", userDetail);
});

register.addEventListener("click", function (ev) {
    let userName = rUserNameId.value;
    if(!userName){
        alert("Enter username");
        return;
    }
    let password = rPasswordId.value;
    if(!password){
        alert("Enter password");
        return;
    }
    let name = rNameId.value;
    if(!name){
        alert("Enter name");
        return;
    }
    let userDetail = {
        "userName": userName,
        "password": password,
        "name": name
    };
    socket.emit("registerUser", userDetail);
});

socket.on("loginResult",function(result){
    if(result){
        console.log("login success");
        loginResultLabel.innerText="";
        window.location.href="/chat";
    }
    else{
        loginResultLabel.innerText="username or password is incorrect";
        console.log("username or password is incorrect");
    }
});

socket.on("registerResult",function(result){
    if(result){
        console.log("register success");
        registerationResultLabel.innerText="";
        window.location.href="/chat";
    }
    else{
        console.log("username already exist");
        registerationResultLabel.innerText="username already exist";
    }
});