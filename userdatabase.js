const fs=require("fs");
let usersData={};

function readData(){
    usersData=JSON.parse(fs.readFileSync("./userdata.json","utf-8"));
}

function registerUser(userDetail,socket){
    readData();
    if(!usersData){
        usersData={};
    }
    usersData[userDetail.userName]={
        "userName":userDetail.userName,
        "password":userDetail.password,
        "name":userDetail.name,
        "connection":socket
    }
    fs.writeFileSync("./userdata.json",JSON.stringify(usersData,null,1));
}
function getUser(userName){
    readData();
    let user=usersData[userName];
    return user;
}
function updateSocket(userName,socket){
    readData();
    usersData[userName].connection=socket;
    fs.writeFileSync("./userdata.json",JSON.stringify(usersData,null,1));
}

module.exports={
    registerUser,
    getUser,
    updateSocket
};